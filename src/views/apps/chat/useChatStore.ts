import type {
  ChatContact,
  ChatContactWithChat,
  ChatMessage,
  ChatOut,
} from "@db/apps/chat/types";
import type { ActiveChat } from "./useChat";

interface State {
  chatsContacts: ChatContactWithChat[];
  contacts: ChatContact[];
  profileUser: ChatContact | undefined;
  activeChat: ActiveChat;
}

export const useChatStore = defineStore("chat", {
  // ℹ️ arrow function recommended for full type inference
  state: (): State => ({
    contacts: [],
    chatsContacts: [],
    profileUser: undefined,
    activeChat: null,
  }),
  actions: {
    async fetchChatsAndContacts(q: string) {
      const { data, error } = await useApi<any>(
        createUrl("/apps/chat/chats-and-contacts", {
          query: {
            q,
          },
        }),
      );

      if (error.value) {
        console.log(error.value);
      } else {
        const { chatsContacts, contacts, profileUser } = data.value;

        this.chatsContacts = chatsContacts;
        this.contacts = contacts;
        this.profileUser = profileUser;
      }
    },

    async getChat(userId: ChatContact["id"]) {
      console.log(userId);

      const res = await $api(`/apps/chat/chats/${userId}`);
      console.log(res);

      this.activeChat = res;
    },

    async sendMsg(message: ChatMessage | ChatMessage["message"]) {
      const senderId = this.profileUser?.id;
      const response = await $api(
        `apps/chat/chats/${this.activeChat?.contact.id}`,
        {
          method: "POST",
          body: { message, senderId },
        },
      );

      const { msg, chat }: { msg: ChatMessage; chat: ChatOut } = response;

      const simplifyResponse = (response: any) => {
        return {
          mediaType: response.message.mediaType,
          mediaUrl: response.message.mediaUrl,
          feedback: response.message.feedback,
          message: response.message.message,
          senderId: response.message.senderId,
          time: response.message.time,
        };
      };

      // ? If it's not undefined => New chat is created (Contact is not in list of chats)
      if (chat !== undefined) {
        const activeChat = this.activeChat!;
        this.chatsContacts.push({
          ...activeChat.contact,
          chat: {
            id: chat.id,
            lastMessage: [],
            unseenMsgs: 0,
            messages: [msg],
          },
        });

        if (this.activeChat) {
          this.activeChat.chat = {
            id: chat.id,
            messages: [msg],
            unseenMsgs: 0,
            userId: this.activeChat?.contact.id,
          };
        }
      } else {
        // Set Last Message for active contact
        const simplifiedResponse = simplifyResponse(msg);
        this.activeChat?.chat?.messages.push(simplifiedResponse);
      }
      const contact = this.chatsContacts.find((c) => {
        if (this.activeChat) return c.id === this.activeChat.contact.id;

        return false;
      }) as ChatContactWithChat;

      contact.chat.lastMessage = msg;
    },
  },
});
