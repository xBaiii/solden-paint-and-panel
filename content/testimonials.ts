/**
 * Customer testimonials, verbatim from soldenpaintandpanel.com.au/testimonials.
 *
 * These are quoted exactly as published, with the same first-name-plus-initial
 * attribution the business itself uses. Do not edit the wording, and do not add
 * star ratings or dates — the source does not publish either, and inventing
 * them would be fabricating review data.
 */

export type Testimonial = { author: string; quote: string };

export const testimonials: Testimonial[] = [
  {
    author: "Daniel B",
    quote:
      "The best family run paint and panel shop business around, Mick and Vanessa take so much pride in what they do. 110% recommended.",
  },
  {
    author: "Jordan J",
    quote:
      "Mick and Vanessa are absolutely amazing. I cannot thank these guys enough, they've looked after me so well.",
  },
  {
    author: "Marie F",
    quote:
      "The service and the repair job itself were professional and very competent. Thoroughly recommended!",
  },
  {
    author: "Daniela F",
    quote:
      "I could not have asked for better service and treatment, From the minute I got them to look at my car till my car was ready to give back to me 10/10 service.",
  },
  {
    author: "Matthew L",
    quote:
      "The slogan says it all - 'done right the first time... on time'. I am very impressed.",
  },
  {
    author: "Chris M",
    quote:
      "I can absolutely and unreservedly recommend Mick & Vanessa's shop! They have done an amazing job on my car!",
  },
  {
    author: "Lance H",
    quote:
      "Everything happened in the way and the time frame he suggested. Ultimately the quality of the job was simply first class.",
  },
  {
    author: "Dawn R",
    quote:
      "Excellent and efficient service. Great job and the car valeted. All for a good price. Would highly recommend.",
  },
  {
    author: "Dan C",
    quote:
      "Only panel shop i would have touch my car. The team at Solden's have a passion for what they do.",
  },
  {
    author: "Vanessa R",
    quote:
      "10/10 to Solden Paint n Panel. I highly recommend them to take care of your vehicle.",
  },
  {
    author: "Mark P",
    quote:
      "Mick was extremely informative, helpful and easy to deal with. Would not hesitate to use again.",
  },
  {
    author: "Fiona J",
    quote:
      "Thank you to Micheal, Vanessa and the team at Solden for not only the repairs but also the great service.",
  },
  {
    author: "Amanda T",
    quote:
      "OMG so so happy with the work done on my GTP. These guys are the best.",
  },
  {
    author: "Christine H",
    quote:
      "They looked after my car like it was there own, and did an outstanding job!!!!",
  },
  {
    author: "Jason S",
    quote:
      "Perfect colour match including a three layer white colour. Very very happy with the finished job.",
  },
  {
    author: "Deb K",
    quote:
      "'Just like a new one' was my daughters comment. The whole process was stress free and on time.",
  },
  {
    author: "Bailey M",
    quote:
      "10/10 Experience from Mick and Vanessa's business! Both repairs have been exceptional.",
  },
  {
    author: "Stephen B",
    quote:
      "Thank you for the awesome paint repairs to my land cruiser, very happy with the outcome.",
  },
];

/** A short rotation for the homepage carousel. */
export const featuredTestimonials = testimonials.slice(0, 8);
