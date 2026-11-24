import type { TrajectoryStop } from '~/types/trajectory'

export const TRAJECTORY_STOPS: readonly TrajectoryStop[] = [
  {
    id: 'tres-passos',
    place: 'Três Passos, RS, Brazil',
    location: [-27.4558, -53.9319],
    zoom: 2.4,
    text: 'I grew up in a small town in southern Brazil, raised by my grandparents and surrounded by nature, creative activities and music.',
    photos: [
      {
        src: '/media/about/brazil-3.jpg',
        alt: 'A girl with big dreams and bare feet',
        year: 2011,
        tooltip: 'Tiny Bruna. Always an adventurer.',
      },
      {
        src: '/media/about/brazil-1.jpeg',
        alt: 'Bruna playing guitar at a competition',
        year: 2018,
        tooltip: 'I was 14 at this band competition. We won.',
      },
      {
        src: '/media/about/brazil-2.jpg',
        alt: "Colorful flowers from grandma's garden",
        year: 2020,
        tooltip: "Grandma's garden > any design inspiration board.",
      },
    ],
  },
  {
    id: 'porto-alegre',
    place: 'Porto Alegre, RS, Brazil',
    location: [-30.0346, -51.2177],
    zoom: 2.4,
    text: 'At 15, I joined a military high school. I woke up at 5am, marched in the cold... It was hard, but it taught me strong values and I met the love of my life there. At school we built a mental health app together and got recognised by Google. Since then, we are always creating new things together.',
    photos: [
      {
        src: '/media/about/school-3.jpeg',
        alt: 'Military high school, first year graduation day',
        year: 2019,
        tooltip: '5am wake-ups build character. Or so they say...',
      },
      {
        src: '/media/about/school-1.jpeg',
        alt: 'Military high school, final graduation day',
        year: 2021,
        tooltip: 'Medal collection.',
      },
      {
        src: '/media/about/school-2.jpg',
        alt: 'Bruna and Angelo working at the café',
        year: 2022,
        tooltip: 'Always building something new together.',
      },
    ],
  },
  {
    id: 'valle-di-blenio',
    place: 'Valle di Blenio, Ticino, Switzerland',
    location: [46.455, 8.937],
    zoom: 3.2,
    text: "Ticino was my home for three years, and I loved it. I learned Italian, lived close to nature and stayed active and curious: mountain hikes, mushroom hunting, lake swims, calisthenics, piano and acoustic guitar.",
    photos: [
      {
        src: '/media/about/alps-3.jpg',
        alt: 'Bruna hiking a trail in the Swiss Alps',
        year: 2023,
        tooltip: 'Memories from my time in Ticino.',
      },
      {
        src: '/media/about/alps-4.jpg',
        alt: 'Wild mushrooms found in the forest',
        year: 2024,
        tooltip: 'Look the delicious I found. Did not die.',
      },
    ],
  },
  {
    id: 'biasca',
    place: 'Biasca, Ticino, Switzerland',
    location: [46.359, 8.97],
    zoom: 3.2,
    text: "Once a month, I volunteered at a retirement home in Biasca, where my old friends taught me how to dance. And whenever I could, I went for a run. I'm convinced that a full life makes a better designer.",
    photos: [
      {
        src: '/media/about/volunteer.jpeg',
        alt: 'Bruna dancing with a resident at a retirement home in Biasca',
        year: 2023,
        tooltip: 'Learning to dance with my old friends at the retirement home.',
      },
      {
        src: '/media/about/running-bellinzona.png',
        alt: 'Bruna running in a race in Bellinzona',
        year: 2024,
        tooltip: 'The most medieval run in the world. Bellinzona.',
      },
      {
        src: '/media/about/alps-2.jpg',
        alt: 'Biasca, where I used to live in Ticino',
        year: 2024,
        tooltip: 'Small city surrounded by the Swiss Alps.',
      },
    ],
  },
  {
    id: 'zurich',
    place: 'Zurich, Switzerland',
    location: [47.3769, 8.5417],
    zoom: 3.2,
    text: "After living in Ticino, I now call Zurich home. I believe Aristotle was right: the purpose of knowledge is action, not knowledge itself. I've been self-taught since the beginning, learning by doing, breaking things, and building them back better. I started in code. Then design took over, but the code never left. That combination is my biggest asset.",
    photos: [
      {
        src: '/media/about/zurich-1.jpeg',
        alt: 'People taking notes at an event in Zurich',
        year: 2026,
      },
      {
        src: '/media/about/zurich-2.jpeg',
        alt: "Autumn tree beside the glass domes of Zurich's botanical garden",
        year: 2026,
      },
      {
        src: '/media/about/zurich-3.jpeg',
        alt: 'A laptop with code open at a study desk',
        year: 2026,
      },
    ],
  },
]
