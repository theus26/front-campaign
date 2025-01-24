import type { Chat, ChatContact } from '@db/apps/chat/types'

import avatar1 from '@images/avatars/avatar-1.png'
import avatar2 from '@images/avatars/avatar-2.png'
import avatar3 from '@images/avatars/avatar-3.png'
import avatar4 from '@images/avatars/avatar-4.png'
import avatar5 from '@images/avatars/avatar-5.png'
import avatar6 from '@images/avatars/avatar-6.png'
import avatar8 from '@images/avatars/avatar-8.png'

interface DB {
  profileUser: ChatContact & {
    settings: {
      isTwoStepAuthVerificationEnabled: boolean
      isNotificationsOn: boolean
    }
  }
  contacts: ChatContact[]
  chats: Chat[]
}

const previousDay = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
const dayBeforePreviousDay = new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 2)

export const db: DB = {
  profileUser: {
    id: 11,
    avatar: avatar1,
    fullName: 'John Doe',
    role: 'admin',
    about:
      'Dessert chocolate cake lemon drops jujubes. Biscuit cupcake ice cream bear claw brownie marshmallow.',
    status: 'online',
    settings: {
      isTwoStepAuthVerificationEnabled: true,
      isNotificationsOn: false,
    },
  },

  contacts: [
    {
      id: 1,
      fullName: 'Gavin Griffith',
      role: 'Frontend Developer',
      about: 'Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing',
      avatar: avatar5,
      status: 'offline',
    },
    {
      id: 2,
      fullName: 'Harriet McBride',
      role: 'UI/UX Designer',
      about:
        'Toffee caramels jelly-o tart gummi bears cake I love ice cream lollipop. Sweet liquorice croissant candy danish dessert icing. Cake macaroon gingerbread toffee sweet.',
      avatar: avatar2,
      status: 'busy',
    },
    {
      id: 3,
      fullName: 'Danny Conner',
      role: 'Town planner',
      about:
        'Soufflé soufflé caramels sweet roll. Jelly lollipop sesame snaps bear claw jelly beans sugar plum sugar plum.',
      avatar: '',
      status: 'away',
    },
    {
      id: 4,
      fullName: 'Janie West',
      role: 'Data scientist',
      about:
        'Chupa chups candy canes chocolate bar marshmallow liquorice muffin. Lemon drops oat cake tart liquorice tart cookie. Jelly-o cookie tootsie roll halvah.',
      avatar: '',
      status: 'online',
    },
    {
      id: 5,
      fullName: 'Bryan Murray',
      role: 'Dietitian',
      about: 'Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing',
      avatar: avatar5,
      status: 'busy',
    },
    {
      id: 6,
      fullName: 'Albert Underwood',
      role: 'Marketing executive',
      about:
        'Toffee caramels jelly-o tart gummi bears cake I love ice cream lollipop. Sweet liquorice croissant candy danish dessert icing. Cake macaroon gingerbread toffee sweet.',
      avatar: avatar6,
      status: 'online',
    },
    {
      id: 7,
      fullName: 'Adele Ross',
      role: 'Special educational needs teacher',
      about:
        'Biscuit powder oat cake donut brownie ice cream I love soufflé. I love tootsie roll I love powder tootsie roll.',
      avatar: '',
      status: 'online',
    },
    {
      id: 8,
      fullName: 'Mark Berry',
      role: 'Advertising copywriter',
      about:
        'Bear claw ice cream lollipop gingerbread carrot cake. Brownie gummi bears chocolate muffin croissant jelly I love marzipan wafer.',
      avatar: avatar3,
      status: 'away',
    },
    {
      id: 9,
      fullName: 'Joseph Evans',
      role: 'Designer, television/film set',
      about:
        'Gummies gummi bears I love candy icing apple pie I love marzipan bear claw. I love tart biscuit I love candy canes pudding chupa chups liquorice croissant.',
      avatar: avatar8,
      status: 'offline',
    },
    {
      id: 10,
      fullName: 'Blake Carter',
      role: 'Building surveyor',
      about: 'Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing',
      avatar: avatar4,
      status: 'away',
    },
  ],

  chats: [
    {
      id: 1,
      userId: 2,
      unseenMsgs: 0,
      messages: [
        // {
        //   message: 'Hi',
        //   time: 'Mon Dec 10 2018 07:45:00 GMT+0000 (GMT)',
        //   senderId: 11,
        //   mediaType: 'text',
        //   feedback: {
        //     isSent: true,
        //     isDelivered: true,
        //     isSeen: true,
        //   },
        // },
        // {
        //   message: 'Hello. How can I help You?',
        //   time: 'Mon Dec 11 2018 07:45:15 GMT+0000 (GMT)',
        //   senderId: 2,
        //   feedback: {
        //     isSent: true,
        //     isDelivered: true,
        //     isSeen: true,
        //   },
        // },
        // {
        //   message: 'Can I get details of my last transaction I made last month? 🤔',
        //   time: 'Mon Dec 11 2018 07:46:10 GMT+0000 (GMT)',
        //   senderId: 11,
        //   mediaType: 'text',
        //   feedback: {
        //     isSent: true,
        //     isDelivered: true,
        //     isSeen: true,
        //   },
        // },
        // {
        //   message: 'We need to check if we can provide you such information.',
        //   time: 'Mon Dec 11 2018 07:45:15 GMT+0000 (GMT)',
        //   senderId: 2,
        //   feedback: {
        //     isSent: true,
        //     isDelivered: true,
        //     isSeen: true,
        //   },
        // },
        // {
        //   message: 'I will inform you as I get update on this.',
        //   time: 'Mon Dec 11 2018 07:46:15 GMT+0000 (GMT)',
        //   senderId: 2,
        //   feedback: {
        //     isSent: true,
        //     isDelivered: true,
        //     isSeen: true,
        //   },
        // },
        // {
        //   message: 'If it takes long you can mail me at my mail address.',
        //   time: String(dayBeforePreviousDay),
        //   senderId: 11,
        //   mediaType: 'text',
        //   feedback: {
        //     isSent: true,
        //     isDelivered: false,
        //     isSeen: false,
        //   },
        // },
      ],
    },
    {
      id: 2,
      userId: 1,
      unseenMsgs: 1,
      messages: [
        // {
        //   message: 'How can we help? We\'re here for you!',
        //   time: 'Mon Dec 10 2018 07:45:00 GMT+0000 (GMT)',
        //   senderId: 11,
        //   mediaType: 'text',
        //   feedback: {
        //     isSent: true,
        //     isDelivered: true,
        //     isSeen: true,
        //   },
        // },
        // {
        //   message: 'Hey John, I am looking for the best admin template. Could you please help me to find it out?',
        //   time: 'Mon Dec 10 2018 07:45:23 GMT+0000 (GMT)',
        //   senderId: 1,
        //   feedback: {
        //     isSent: true,
        //     isDelivered: true,
        //     isSeen: true,
        //   },
        // },
        // {
        //   message: 'It should use nice Framework.',
        //   time: 'Mon Dec 10 2018 07:45:55 GMT+0000 (GMT)',
        //   senderId: 1,
        //   feedback: {
        //     isSent: true,
        //     isDelivered: true,
        //     isSeen: true,
        //   },
        // },
        // {
        //   message: 'Absolutely!',
        //   time: 'Mon Dec 10 2018 07:46:00 GMT+0000 (GMT)',
        //   senderId: 11,
        //   mediaType: 'text',
        //   feedback: {
        //     isSent: true,
        //     isDelivered: true,
        //     isSeen: true,
        //   },
        // },
        // {
        //   message: 'Our admin is the responsive admin template.!',
        //   time: 'Mon Dec 10 2018 07:46:05 GMT+0000 (GMT)',
        //   senderId: 11,
        //   mediaType: 'text',
        //   feedback: {
        //     isSent: true,
        //     isDelivered: true,
        //     isSeen: true,
        //   },
        // },
        // {
        //   message: 'Looks clean and fresh UI. 😍',
        //   time: 'Mon Dec 10 2018 07:46:23 GMT+0000 (GMT)',
        //   senderId: 1,
        //   feedback: {
        //     isSent: true,
        //     isDelivered: true,
        //     isSeen: true,
        //   },
        // },
        // {
        //   message: 'It\'s perfect for my next project.',
        //   time: 'Mon Dec 10 2018 07:46:33 GMT+0000 (GMT)',
        //   senderId: 1,
        //   feedback: {
        //     isSent: true,
        //     isDelivered: true,
        //     isSeen: true,
        //   },
        // },
        // {
        //   message: 'How can I purchase it?',
        //   time: 'Mon Dec 10 2018 07:46:43 GMT+0000 (GMT)',
        //   senderId: 1,
        //   feedback: {
        //     isSent: true,
        //     isDelivered: true,
        //     isSeen: true,
        //   },
        // },
        // {
        //   message: 'Thanks, From our official site  😇',
        //   time: 'Mon Dec 10 2018 07:46:53 GMT+0000 (GMT)',
        //   mediaType: 'image',
        //   mediaUrl: 'data:image/png;base64,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',
        //   senderId: 11,
        //   feedback: {
        //     isSent: true,
        //     isDelivered: true,
        //     isSeen: true,
        //   },
        // },
        // {
        //   message: 'I will purchase it for sure. 👍',
        //   time: String(previousDay),
        //   senderId: 1,
        //   feedback: {
        //     isSent: true,
        //     isDelivered: true,
        //     isSeen: true,
        //   },
        // },
      ],
    },
  ],
}
