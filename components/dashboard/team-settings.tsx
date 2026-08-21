"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import {
  Check,
  Clock,
  Loader2,
  Mail,
  ShieldAlert,
  Trash2,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { USER_ROLES, type UserRole } from "@/convex/lib/constants";
import { formatDateTime, initials } from "@/lib/leads-display";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  owner: "Full access, including owner management. Only one is created automatically.",
  admin: "Can work leads and manage the team.",
  staff: "Can work leads. Cannot manage the team or settings.",
};

export function TeamSettings() {
  const me = useQuery(api.users.me);
  const team = useQuery(api.users.list);
  const invites = useQuery(api.users.listInvites);

  const createInvite = useMutation(api.users.createInvite);
  const revokeInvite = useMutation(api.users.revokeInvite);
  const setRole = useMutation(api.users.setRole);
  const setActive = useMutation(api.users.setActive);

  const [email, setEmail] = useState("");
  const [role, setRole_] = useState<UserRole>("staff");
  const [inviting, setInviting] = useState(false);

  const guard = async (action: () => Promise<unknown>, message: string) => {
    try {
      await action();
      toast.success(message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "That didn't work.");
    }
  };

  const isOwner = me?.role === "owner";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Team</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Accounts are invite-only. Send an invite, then the person signs up with
          that email address on the sign-in page.
        </p>
      </div>

      {/* ---------- invite ---------- */}
      <section className="rounded-xl border p-6">
        <h2 className="flex items-center gap-2 font-semibold tracking-tight">
          <UserPlus className="size-4 text-brand-600" />
          Invite someone
        </h2>

        <form
          onSubmit={async (event) => {
            event.preventDefault();
            setInviting(true);
            try {
              await createInvite({ email, role });
              toast.success(`Invite created for ${email}.`, {
                description: "They can now sign up with that address.",
              });
              setEmail("");
            } catch (error) {
              toast.error(
                error instanceof Error ? error.message : "Couldn't create that invite.",
              );
            } finally {
              setInviting(false);
            }
          }}
          className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <div className="flex-1 space-y-2">
            <Label htmlFor="invite-email">Email address</Label>
            <Input
              id="invite-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@soldenpaintandpanel.com.au"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-11 w-full items-center justify-between gap-2 rounded-md border border-input px-3 text-sm capitalize sm:w-36">
                {role}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {USER_ROLES.filter((option) => option !== "owner" || isOwner).map(
                  (option) => (
                    <DropdownMenuItem
                      key={option}
                      onClick={() => setRole_(option)}
                      className="capitalize"
                    >
                      {option}
                      {role === option && <Check className="ml-auto size-3.5" />}
                    </DropdownMenuItem>
                  ),
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <button
            type="submit"
            disabled={inviting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brand-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-70"
          >
            {inviting && <Loader2 className="size-4 animate-spin" />}
            Send invite
          </button>
        </form>

        <p className="mt-3 text-xs text-muted-foreground">
          {ROLE_DESCRIPTIONS[role]} Invites expire after 14 days.
        </p>
      </section>

      {/* ---------- pending invites ---------- */}
      {invites !== undefined && invites.filter((invite) => !invite.consumed).length > 0 && (
        <section className="rounded-xl border">
          <h2 className="border-b px-6 py-4 font-semibold tracking-tight">
            Pending invites
          </h2>
          <ul className="divide-y">
            {invites
              .filter((invite) => !invite.consumed)
              .map((invite) => (
                <li
                  key={invite._id}
                  className="flex items-center gap-4 px-6 py-4"
                >
                  <Mail className="size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{invite.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {invite.expired ? (
                        <span className="text-destructive">Expired</span>
                      ) : (
                        <>Expires {formatDateTime(invite.expiresAt)}</>
                      )}
                    </p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {invite.role}
                  </Badge>
                  <button
                    type="button"
                    onClick={() =>
                      void guard(
                        () => revokeInvite({ inviteId: invite._id }),
                        "Invite revoked.",
                      )
                    }
                    className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    title="Revoke invite"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
          </ul>
        </section>
      )}

      {/* ---------- members ---------- */}
      <section className="rounded-xl border">
        <h2 className="border-b px-6 py-4 font-semibold tracking-tight">
          Members
        </h2>

        {team === undefined ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <ul className="divide-y">
            {team.map((member) => {
              const isSelf = member._id === me?._id;
              return (
                <li key={member._id} className="flex items-center gap-4 px-6 py-4">
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white",
                      member.active ? "bg-ink-900" : "bg-neutral-400",
                    )}
                  >
                    {initials(member.name ?? member.email)}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 truncate text-sm font-medium">
                      {member.name ?? member.email ?? "Unknown"}
                      {isSelf && (
                        <span className="text-xs font-normal text-muted-foreground">
                          (you)
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {member.email ?? "No email"}
                    </p>
                  </div>

                  {!member.active && (
                    <Badge variant="outline" className="gap-1.5 text-muted-foreground">
                      <Clock className="size-3" />
                      Deactivated
                    </Badge>
                  )}

                  {/* Role: not editable for yourself, and only an owner can touch owners. */}
                  {isSelf || (member.role === "owner" && !isOwner) ? (
                    <Badge variant="outline" className="capitalize">
                      {member.role ?? "staff"}
                    </Badge>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="rounded-md border border-input px-3 py-1.5 text-xs font-medium capitalize transition-colors hover:bg-accent">
                        {member.role ?? "staff"}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {USER_ROLES.filter(
                          (option) => option !== "owner" || isOwner,
                        ).map((option) => (
                          <DropdownMenuItem
                            key={option}
                            className="capitalize"
                            onClick={() =>
                              void guard(
                                () => setRole({ userId: member._id, role: option }),
                                `${member.name ?? member.email} is now ${option}.`,
                              )
                            }
                          >
                            {option}
                            {member.role === option && (
                              <Check className="ml-auto size-3.5" />
                            )}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuItem
                          onClick={() =>
                            void guard(
                              () =>
                                setActive({
                                  userId: member._id,
                                  active: !member.active,
                                }),
                              member.active ? "Account deactivated." : "Account reactivated.",
                            )
                          }
                          className={member.active ? "text-destructive" : undefined}
                        >
                          <ShieldAlert className="size-3.5" />
                          {member.active ? "Deactivate" : "Reactivate"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <p className="text-xs text-muted-foreground">
        Roles are enforced on the server in every Convex function, not just hidden
        in this interface.
      </p>
    </div>
  );
}
