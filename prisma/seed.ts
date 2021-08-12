import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const userData = [
  {
    bio: "I love turtles",
    email: "john@moonpay.com",
    password: "themostsecurepasswordintheworld",   
    username: "john",
    articles: { 
      create:[
        {
          slug: "2dmoon",
          title: "Moonpay Is Going to the sun",
          description: "Lorem ipsum dolor sit amet",
          body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel mi finibus, posuere elit eget, vehicula metus. Vestibulum a eleifend massa, nec faucibus lacus. Proin sit amet erat et dolor pulvinar mollis. Mauris dictum ipsum nec mi pretium rutrum. Nunc rutrum nisl elit, auctor aliquet enim sagittis feugiat. Nulla sed leo ut tortor vehicula luctus non quis nunc. In sed mi vulputate, aliquet lorem id, eleifend sem. Aenean euismod nunc at ligula finibus, ut aliquam quam tristique. Donec vestibulum tempus odio ut fermentum.",
          tagList: "moonpay,moon,cryptocurrency,bitcoin",
        },
      ],
    },
  },
  {
    bio: "I love turtles",
    email: "david@moonpay.com",
    password: "themostsecurepasswordintheworld",   
    username: "david",
    articles: { 
      create:[
        {
          slug: "moon2d",
          title: "Moonpay Is Going to the sun",
          description: "Lorem ipsum dolor sit amet",
          body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel mi finibus, posuere elit eget, vehicula metus. Vestibulum a eleifend massa, nec faucibus lacus. Proin sit amet erat et dolor pulvinar mollis. Mauris dictum ipsum nec mi pretium rutrum. Nunc rutrum nisl elit, auctor aliquet enim sagittis feugiat. Nulla sed leo ut tortor vehicula luctus non quis nunc. In sed mi vulputate, aliquet lorem id, eleifend sem. Aenean euismod nunc at ligula finibus, ut aliquam quam tristique. Donec vestibulum tempus odio ut fermentum.",
          tagList: "moonpay,moon,cryptocurrency,bitcoin",
        }
      ],
    },
  },
  {
    bio: "I love turtles",
    email: "awesomeperson@moonpay.com",
    password: "themostsecurepasswordintheworld",   
    username: "awesomeperson",
    articles: { 
      create:[
        {
          slug: "d2moon",
          title: "Moonpay Is Going to the sun",
          description: "Lorem ipsum dolor sit amet",
          body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel mi finibus, posuere elit eget, vehicula metus. Vestibulum a eleifend massa, nec faucibus lacus. Proin sit amet erat et dolor pulvinar mollis. Mauris dictum ipsum nec mi pretium rutrum. Nunc rutrum nisl elit, auctor aliquet enim sagittis feugiat. Nulla sed leo ut tortor vehicula luctus non quis nunc. In sed mi vulputate, aliquet lorem id, eleifend sem. Aenean euismod nunc at ligula finibus, ut aliquam quam tristique. Donec vestibulum tempus odio ut fermentum.",
          tagList: "moonpay,moon,cryptocurrency,bitcoin",
        }
      ],
    },
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })