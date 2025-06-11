<script setup lang="ts">
import type { CampaignDraft } from "@/store/campaign";
import { useCampaignStore } from "@/store/campaign";
import type { CustomInputContent } from "@core/types";
import customWizardAccount from "@images/svg/wizard-account.svg";
import customWizardAddress from "@images/svg/wizard-address.svg";
import customWizardPersonal from "@images/svg/wizard-personal.svg";
import customWizardSocialLink from "@images/svg/wizard-social-link.svg";
import { themeConfig } from "@themeConfig";
import { useToast } from "vue-toast-notification";
import { VForm } from "vuetify/components/VForm";
import * as XLSX from "xlsx";
import MessageComponent from "./components/message.vue";

import type { ECommerceProduct } from "@db/apps/ecommerce/types";

export interface IProvider {
  id: number
  providerId: string;
  credential: string;
  name: string;
  accountId: string;
  instanceName: string;
  instanceId: string;
  status: string;
  owner: string | null;
  profileName: string | null;
  profilePictureUrl: string | null;
}

const defaultItem = ref<IProvider>({
  id: -1,
  providerId: "",
  credential: "",
  name: "",
  accountId: "",
  instanceName: "",
  instanceId: "",
  status: "",
  owner: null,
  profileName: null,
  profilePictureUrl: null,
});

const img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVwAAAFcCAYAAACEFgYsAAAi6UlEQVR4AezBwY1kQY5EwdcfJQTlohQuEqVwuahFbx95CiCQWX9mFjT78/cf1lpr/bqHtdZar3hYa631ioe11lqveFhrrfWKh7XWWq94WGut9YqHtdZar3hYa631ioe11lqveFhrrfWKh7XWWq/44VJk8aa2mCKLk7b4RGQxtcUUWUxtMUUWv6ktpshiaospspjaYoosTtriE5HFjbaYIosbbXESWUxtMUUWJ21xI7K40RYnkcVJW0yRxdQWU2Rxoy2myOKkLabI4qQtPhFZvKktbjystdZ6xcNaa61XPKy11nrFDx9qi2+KLE7a4hORxUlbTJHFjbaYIoupLabI4psii6ktpshiaov/pLaYIoupLabIYmqLKbKY2uITbfGJtpgii5PIYmqLb4ospraYIoupLU7a4iSymNpiiiymyOJGW5y0xTdFFp94WGut9YqHtdZar3hYa631ih++LLK40RY3IosbbTG1xUlkcSOymNriN0UWvymymNriRmQxtcUUWdyILE4ii6ktpshiaotviiymtrjRFjfa4hNtMUUWJ5HFSVtMkcXUFlNkcaMtpsjiE5HFjbb4poe11lqveFhrrfWKh7XWWq/44X9MW0yRxdQWU2Rx0hafaIspsjiJLKa2OIksTtpiiixuRBZTW5xEFlNbTG0xRRY32mKKLKa2mCKLk7aYIoupLaa2mCKLqS1OIos3RRZTW0xtMUUWJ20xRRYnkcWNtjiJLP4/e1hrrfWKh7XWWq94WGut9Yof/sdEFlNbnLTFFFlMkcXUFlNkcRJZnLTFFFlMkcXUFjcii5PI4kZkcdIWU2Rxoy2myOJGZHESWdyILE7aYoosflNkMbXFjcjipC1OIoupLabIYmqLk8hiaouTtjhpi/9lD2uttV7xsNZa6xUPa621XvHDl7XFb2qLKbI4aYupLabIYoosTtriJLK40RZTZDG1xRRZTG1xI7K40RYnbTFFFlNbTJHFjbaYIoupLabIYmqLKbK4EVmctMWNyOKkLd4UWZxEFlNbTJHFJyKLqS2myGJqi0+0xX/Sw1prrVc8rLXWesXDWmutV/zwocjiTZHF1BZTZHESWUxtMUUWU1tMkcXUFv9NIoupLU7aYoosTiKLqS0+0RZTZPGmtpgii6ktpsjiJLKY2uJGZDG1xRRZTG0xRRZTW0yRxdQWU2QxtcUUWUxtMUUWU1tMkcXUFlNkMbXFFFlMbXESWfw3eVhrrfWKh7XWWq94WGut9YofLrXF/yeRxdQWU2TxmyKLqS0+0RafaIspspjaYoosprY4aYtPtMUUWUxtMUUWb2qLT7TFFFncaIuTtjhpiymyOIkspraYIotPRBZTW5y0xX+zh7XWWq94WGut9YqHtdZar/jz9x/+gyKLk7Y4iSymtvhEZPGf1BZTZPGb2mKKLKa2mCKLb2qLG5HFm9piiix+U1t8IrKY2mKKLKa2OIksTtpiiiymtpgii29qiymymNpiiiymtpgii6ktpshiaosbD2uttV7xsNZa6xUPa621XvHDpcjiN7XFFFlMbXEjspja4qQtpshiaospsjhpiymy+ERbTJHFSVtMkcUUWUxtcdIWU2Rx0hZTZPFNbXEjspjaYoosTtpiiiymtpgii5O2OIksTtpiaouTtvhNbTFFFidtMUUWU1vcaIspsvimtvjEw1prrVc8rLXWesXDWmutV/xwqS1OIosbbTFFFp+ILKa2uBFZTG1x0hYnkcVvaospspgii6ktTiKLG20xRRYnbTFFFlNbTJHFSWRxoy2myOJGZDG1xUlbTJHFb4osTtriJLL4bxZZnLTF1BZTZDFFFieRxdQWn3hYa631ioe11lqveFhrrfWKP3//4QORxdQWvymymNriE5HFSVtMkcXUFjcii6ktpshiaospspja4iSymNpiiixO2mKKLE7aYoosprb4TZHFSVvciCxutMWNyGJqiymymNpiiiymtpgii6ktbkQWU1tMkcVJW0yRxdQWU2QxtcWNyOKkLabI4qQtvulhrbXWKx7WWmu94mGttdYrfviyyOJ/WVvciCxO2uIkspjaYoospra40RZTZHHSFt/UFp+ILG60xRRZTJHF1BbfFFlMbTFFFlNb3Igsprb4RGRxI7K4EVmcRBZTW0yRxUlb3IgspraYIospspja4hMPa621XvGw1lrrFQ9rrbVe8cOlyGJqi5PI4kZbTJHFjcjiRlucRBZTW0yRxUlkMbXFFFlMkcXUFieRxdQW3xRZTG0xRRYnkcU3tcUUWZy0xY3I4hNt8YnIYmqL39QWU2Rx0ha/KbKY2uIksrjRFlNkMbXFSWQxtcWNh7XWWq94WGut9YqHtdZar/jhUltMkcVJW5xEFlNkcdIWN9piiiymyOJGZDG1xUlk8YnIYmqLqS2myOKkLabIYoospraYIosbbTFFFidtcRJZTG1xI7KY2uKkLabI4kZkcRJZnEQWU1tMkcWNyOITkcVJW9yILG5EFidtMUUWn4gsvulhrbXWKx7WWmu94mGttdYrfvhQW5xEFlNbnLTFjchiaospspja4kZkMbXFSWQxtcVJW5xEFlNkcdIW3xRZTG1xEllMbTG1xUlkMbXFjchiaotPRBYnbTFFFlNbTJHF1BZTZPFNbXESWUxtcSOyOIkspraY2uITbTFFFieRxUlkMbXFFFl84mGttdYrHtZaa73iYa211iv+/P2HC5HF1BZTZDG1xY3I4kZb3IgspraYIouTtjiJLE7aYoosprb4RGQxtcUnIoupLU4ii6ktbkQWn2iLG5HFSVvciCxO2uIkspja4k2RxY22mCKLqS1uRBYnbXEjsjhpiymymNrimx7WWmu94mGttdYrHtZaa73ih0ttcSOymNripC2myGJqi5PIYmqL/yWRxdQW3xRZnLTFSWQxtcVJZHHSFlNb/KbIYmqLk8hiaosbbTFFFlNbTG0xRRZTW9yILE7a4qQt3tQWJ5HFjbb4RGRx0hY3HtZaa73iYa211ise1lprveKHS5HF1BYnbTFFFlNbTJHF1BZTZDG1xUlkMbXFjba40RZTZDFFFlNbTJHFFFmctMVJZHHSFlNkcdIWU2Txichiaospsjhpi5PIYmqLKbKY2mJqi09EFjciixuRxdQWJ23xTZHF1BY3IoupLU7a4iSymCKLk7Z408Naa61XPKy11nrFw1prrVf88KHI4iSymNripC0+0RZTZHESWUxt8YnIYmqLKbI4aYspspja4qQtTiKLKbKY2uKb2mKKLE4ii6ktbkQWU1uctMVJZHHSFlNbTJHFjbaYIotPtMVJZHESWZy0xRRZ/Ddpi5PI4k0Pa621XvGw1lrrFQ9rrbVe8efvP1yILKa2+KbIYmqLKbL4prY4iSxutMUUWUxtcSOyOGmLKbL4praYIoupLabI4kZb3Igspra4EVlMbfGJyOITbfGJyOKkLW5EFjfa4hORxUlb/CdFFlNbfOJhrbXWKx7WWmu94mGttdYrfvhlkcXUFidtcdIW3xRZvCmyOGmLqS2myGKKLE7aYoospraYIospsvhEW9yILKa2mNriJLKY2uIkspjaYoospra40Ra/qS2+qS2myGJqi5PI4kZb3IgsTtpiiiymtvhPelhrrfWKh7XWWq94WGut9YofLrXFSWQxtcUUWfymtvhEW9yILKbIYmqLk8hiiixutMUUWUyRxY22mCKL3xRZ3IgsflNkMbXFFFlMbTFFFjcii5O2+ERkMbXFSWQxtcUUWUxtMbXFJyKLk7aYIosbkcXUFlNk8Zse1lprveJhrbXWKx7WWmu94odLkcVJW0yRxY22mCKLqS0+EVlMbTFFFidt8YnIYmqLk8hiaouTtjiJLE4ii6ktpsjiE5HFSVvcaIsbbXEjsvhEZHHSFjcii09EFidtMUUWU1ucRBY32uKbIouTtpgii5O2+KaHtdZar3hYa631ioe11lqv+OFDbfFNkcVJZDG1xRRZfKItpsjipC1OIoupLU4ii6ktpsjiN7XFf1JkcdIWU2QxtcUnIosbkcUnIoupLabI4pva4hORxUlbTJHF1BYnbXESWXwisvhEZDG1xY2HtdZar3hYa631ioe11lqv+PP3H35RZHHSFjciixttMUUWN9riJLKY2uKbIouTtrgRWXxTW9yILKa2+ERkMbXFjcjiE21xI7KY2uIksjhpi5PI4qQtpsjiRltMkcXUFt8UWUxtcSOyOGmL3/Sw1lrrFQ9rrbVe8bDWWusVP1yKLE7a4hORxdQWN9ripC1OIosbbTFFFlNbTJHFb4osprY4aYspsvimyOIksjhpi2+KLH5TZDG1xX+Ttpgii6ktTiKLk7aYIotPtMWNyGJqi09EFlNbfOJhrbXWKx7WWmu94mGttdYrfrjUFlNk8U1t8YnI4hNtcRJZTG0xtcUUWUxtMUUWU1tMkcWNtrgRWdxoixttMUUWJ20xRRa/qS2myGJqiymyOGmLG5HFjbb4RGRxI7I4iSymtjhpiymyOIksbrTFJyKLqS2+6WGttdYrHtZaa73iYa211it+uBRZTG0xRRZTW0yRxRRZfFNb/Ka2OIks3hRZfFNbTJHFSWRx0hY3IosbbTFFFp9oiymyOIksvqktTiKLk7aY2uIksrjRFlNkcdIWJ20xRRZTW0yRxRRZfKItTiKLk7a48bDWWusVD2uttV7xsNZa6xU/XGqLKbL4praYIouTtpgii5O2OIkspraYIouTtpgii5O2uNEWU2QxtcUUWZy0xRRZnEQWU1tMkcUUWUxt8U2RxdQWU2QxtcWNtpgii6ktTiKLqS2+qS2myGJqi5O2mCKLqS2myOIkspjaYoosprY4iSymtrgRWUxt8Z/0sNZa6xUPa621XvGw1lrrFX/+/sMXRRZTW5xEFt/UFieRxW9qiymy+ERbTJHF1BZTZHHSFjcii6ktTiKLqS1OIoupLW5EFidt8YnI4pva4kZkMbXFFFncaIspspja4iSyOGmLKbK40RZTZDG1xRRZTG0xRRa/qS1uPKy11nrFw1prrVc8rLXWesUPlyKLG5HF1BZTW5xEFlNbnEQWJ20xRRZTW0yRxdQWN9piiiymtjiJLH5TZPGJyOI3RRYnbTFFFlNkcaMtprY4iSymtjiJLKa2mCKLk8hiaospspja4kZkMbXFjcjiN0UWn2iLKbI4aYtvelhrrfWKh7XWWq94WGut9YofLrXFFFlMbXESWUxtMUUWU1tMkcXUFidtMUUWU1tMkcXUFieRxdQWU2TxibaYIotvaouTyOJGW0yRxUlbTJHF1BZTZDFFFlNbnEQWNyKLqS2mtpgiixuRxUlbTJHFSVvcaIuTyOITbTFFFlNb3GiLG21x0hZTZPGbHtZaa73iYa211ise1lprveKHD7XFjbaYIoupLU7a4kZkMbXFSVtMkcXUFp9oiymyOGmLqS0+EVncaIuTtrjRFidtMUUWU1ucRBZTW9yILL6pLd4UWdxoi5O2mCKLqS1utMVJZDG1xScii5O2uBFZTG1x42GttdYrHtZaa73iYa211it++GWRxdQWJ5HFN7XFFFlMbTFFFlNbvKktTiKLb2qLk8jiRltMbfFNkcXUFlNbTJHF1BZTZDG1xSfaYoosprb4RFtMkcVJW0yRxRRZnLTF1BafiCymtvimyGJqi09EFlNbfOJhrbXWKx7WWmu94mGttdYr/vz9hxdFFidt8U2RxdQWU2QxtcVJZDG1xUlkcdIWJ5HFSVtMkcU3tcVJZPGJtrgRWUxtMUUWN9riE5HFjba4EVl8oi1OIosbbTFFFidt8U2RxUlbTJHFSVtMkcXUFlNkMbXFjYe11lqveFhrrfWKh7XWWq/48/cfPhBZTG1xI7I4aYtPRBYnbXEjsvhEW3xTZDG1xScii5O2OIksbrTFFFlMbXEjspjaYoosbrTFFFmctMWNyOI3tcUUWXxTW0yRxUlbTJHFSVvciCymtpgii5O2OIkspra48bDWWusVD2uttV7xsNZa6xU/XIosbkQWJ21xI7KY2mKKLKa2uBFZnLTFFFlMbXEjspja4iSymNpiiixO2uJ/SWRx0hZTW9xoi0+0xRRZnLTF1Ba/KbKY2uJNbXHSFlNkcRJZTG0xtcUUWdyILH7Tw1prrVc8rLXWesXDWmutV/xwqS2myOKkLabIYoosTtpiaouTtpgii5O2OGmLG5HFSVucRBbf1BZTZDG1xdQWU2QxRRZTW3xTW0yRxdQWU2Rx0hY3IouTtjhpi2+KLKa2mCKLb4osprY4iSxuRBZTW5xEFlNbTJHF1BZTW0yRxUlb/KaHtdZar3hYa631ioe11lqv+OFSZHESWdxoi2+KLKa2+KbIYmqLKbKY2mKKLE7a4k2RxUlbTJHFFFlMbXESWUyRxdQWn2iLk7aYIoupLU4ii29qiymyuNEWU2QxtcUnIoupLaa2OIkspraYIouTtpgii5PIYmqLqS1OIosbbXHjYa211ise1lprveJhrbXWK374ZW1xI7KY2uKbIosbkcVJZHGjLU4ii6ktpshiaoupLW60xY22mCKLT7TFSVtMkcXUFjcii6ktTiKLk7b4prY4iSymtrgRWZy0xRRZTJHFSVtMbXHSFlNkcaMtvqktpsjimx7WWmu94mGttdYrHtZaa73ihy9riymyuNEWJ5HF1BYnkcVJW/wnRRZTW5y0xY3IYmqLk8jipC2mtrjRFieRxdQWJ5HF1BafiCymtjiJLE7a4hORxScii5O2mCKLG20xRRZTW0yRxdQWN9piiiymtpgii6ktpsjipC2+6WGttdYrHtZaa73iYa211it+uNQWU2Rx0hZTZHESWUxt8abIYmqLk8hiaospspjaYmqLKbKY2uJGZHEjsrgRWUxtcSOymNpiaospspjaYoosTiKLqS2+qS2myGKKLG60xdQWU2Rx0hZTZHESWUxtcRJZTJHF1BY3IoupLb6pLabIYmqLKbI4iSymtrjxsNZa6xUPa621XvGw1lrrFT98qC1OIouTtrjRFidtMUUWU1tMkcXUFlNkMbXF1BY3Ios3tcUUWZy0xW9qi5PIYmqLKbK40RY32uIkspjaYmqLKbK4EVlMbXEjspja4iSymCKLqS1O2mKKLKa2+ERk8Zsiixtt8YmHtdZar3hYa631ioe11lqv+PP3Hy5EFp9oi5PIYmqLKbI4aYspsjhpi5PI4r9JW9yILD7RFlNkcdIWU2Rxoy2myOKkLabIYmqLk8jiE23xicjipC2myOKkLb4pspja4psii6ktpshiaospsjhpixuRxdQWU2QxtcWNh7XWWq94WGut9YqHtdZar/jz9x++KLKY2mKKLE7a4iSymNriTZHFSVucRBZTW5xEFlNbnEQW/5+0xRRZTG0xRRYnbXESWUxtMUUWU1tMkcVJW3wispjaYoosbrTFjchiaospsjhpixuRxY22mCKLk7Y4iSxO2uLGw1prrVc8rLXWesXDWmutV/z5+w8XIotPtMUUWZy0xRRZTG1xEln8L2mLKbI4aYspspja4iSyOGmLk8hiaosbkcXUFlNkcdIWU2QxtcUUWZy0xSciixttcRJZTG0xRRafaIspsjhpi09EFlNbTJHF1BbfFFl8oi0+8bDWWusVD2uttV7xsNZa6xU/XGqLKbI4aYspsjhpiymymNriRlucRBZTW0yRxY22uBFZnLTFSWRxEllMbXHSFlNkcdIWJ5HF1BY32uJGW9xoixuRxdQWN9piiixO2mKKLKa2OIksprY4aYuTyOJGW5xEFieRxY22+Ka2mCKLqS1uPKy11nrFw1prrVc8rLXWesUPH2qLb4osTiKLqS1uRBZTW9xoi5PIYmqLb4osPhFZTG0xRRZTW0yRxRRZTG0xtcVJW5xEFlNb3Igsprb4psjiRmQxtcVJZDG1xRRZ/KbIYmqLG5HFjbaYIosbkcWNtpgii9/0sNZa6xUPa621XvGw1lrrFT9ciixO2uJGW9yILG5EFieRxdQWJ5HFSVucRBZTW0yRxY22uBFZTJHF1BY32mKKLKa2OIkspraY2mKKLKa2mCKLk8hiaospspja4qQtbkQWU2Rx0hZTZDG1xRRZnEQWU1t8U2QxtcUUWUxtMUUWU1tMkcXUFjciiymyOIksvulhrbXWKx7WWmu94mGttdYrfrjUFlNkcRJZ3IgsprY4iSymtpjaYoospraYIoupLU4iixttcdIWU2RxI7KY2uKkLabIYmqLqS2myGJqixtt8YnIYmqLKbK40RZTZHEjspja4qQtTiKLqS2myOKbIouTyGJqi6ktpsjiRlt8IrKY2uITbfFND2uttV7xsNZa6xUPa621XvHDpchiaotvaosbbTFFFr8psjiJLKa2mCKLqS2myOITbXEjsrgRWXwispjaYoospraY2uIkspja4iSymNpiaospsjhpixuRxSfaYoosprb4prY4iSw+EVlMbXGjLW60xRRZTJHF1BafeFhrrfWKh7XWWq94WGut9Yo/f//hRZHFb2qLKbKY2uITkcVJW3xTZPGb2mKKLKa2mCKLqS1OIotPtMUUWUxtcRJZnLTFFFm8qS2+KbKY2uITkcXUFt8UWUxtMUUWv6ktTiKLk7a48bDWWusVD2uttV7xsNZa6xV//v7DhcjiE20xRRZTW0yRxdQWU2TxibaYIoupLU4ii5O2OIksTtpiiixutMUUWUxtMUUWU1ucRBZTW0yRxY22uBFZTG3xTZHF1BZTZDG1xUlkcaMtpshiaospspjaYoospraYIoupLabIYmqLk8hiaosbkcXUFlNkMbXFFFlMbXESWUxt8U0Pa621XvGw1lrrFQ9rrbVe8efvP1yILKa2OIksTtpiiixutMUUWZy0xScii6ktbkQWU1vciCxutMVJZDG1xUlkMbXFJyKLb2qLk8jipC1OIoupLabIYmqLKbKY2mKKLKa2OIkspra4EVlMbfGJyOKkLabIYmqLKbKY2uKbIoupLU4ii6ktbjystdZ6xcNaa61XPKy11nrFD5fa4psii6ktpshiaospsjhpiymyuNEWJ5HFJyKLqS2myGJqi5PI4kZbTJHFSVvciCymtjhpi5PI4iSymNpiaouTyOKkLabI4iSymNripC2myGJqixuRxdQWU1ucRBY32mKKLD7RFieRxdQWJ5HF1BZTZDG1xTc9rLXWesXDWmutVzystdZ6xQ+/rC1uRBYnkcXUFlNkMUUWJ20xRRY32uJGZHGjLabI4je1xUlkMbXFSVtMkcXUFp9oiymymCKLk7aY2mKKLKbI4qQtpsjiE20xRRY32mKKLE7a4hORxdQW3xRZTG1xElmcRBZTW/ymh7XWWq94WGut9YqHtdZar/jhUmQxtcVJZHHSFlNbTJHFSWRx0hY32mKKLE4ii6ktpsjiE5HFjbaYIoupLX5TZHHSFt8UWZy0xY3IYmqLk8jipC1OIouTtjhpi5PIYmqLk8hiaosbkcUUWZy0xY22+Ka2mCKL3/Sw1lrrFQ9rrbVe8bDWWusVf/7+wwciixttcRJZ/Ce1xRRZTG0xRRYnbXEjspja4iSyOGmLG5HFSVtMkcVJW0yRxdQWn4gsbrTFJyKLqS2myGJqixuRxUlbfCKy+ERb3IgsPtEWU2QxtcUUWUxtMUUWU1ucRBZTW3ziYa211ise1lprveJhrbXWK/78/YcPRBZTW0yRxY22uBFZTG1xI7K40RYnkcVJW9yILKa2uBFZTG0xRRZTW0yRxdQWNyKLqS1OIoupLX5TZDG1xUlkcdIWU2Rxoy2myOKkLb4pspjaYoosflNbTJHF1BY3IotPtMU3Pay11nrFw1prrVc8rLXWesWfv//wXySymNpiiiw+0RYnkcVJW0yRxdQWU2Rx0hZTZDG1xRRZnLTFJyKLG20xRRYnbfGbIoupLabIYmqLKbKY2mKKLKa2+ERkcaMtbkQWv6ktTiKLqS1uRBZTW5xEFidtcSOyOGmLGw9rrbVe8bDWWusVD2uttV7xw5dFFidtcdIWJ23xTZHF1BZTZHEjspjaYoospshiaospsvhEZHHSFidtMUUWvymymNriJLI4iSw+EVlMbTFFFt/UFlNkMUUWU1tMkcWNtpgii6ktbkQWNyKLqS1OIoupLaa2mCKLk8jiTQ9rrbVe8bDWWusVD2uttV7x5+8/XIgsprY4iSxO2mKKLKa2OIksPtEWU2QxtcUUWXyiLabIYmqLG5HF1BZTZHGjLabI4qQtpsjipC2myOKkLU4ii5O2mCKL39QWU2QxtcVviiymtpgii6ktTiKLqS2myGJqiymy+ERbTJHFSVucRBZTW0yRxUlbfOJhrbXWKx7WWmu94mGttdYrfrjUFlNkMbXF1BYnkcXUFlNkcdIWU2Rx0hafaIsbkcUUWXwisrjRFlNkcRJZ3IgspraYIospsjhpiymymNripC1utMUUWXxTW5xEFlNb3IgsTiKLqS1+U2Rx0hYnkcUUWUxtMUUWU2TxTW0xRRZTW9x4WGut9YqHtdZar3hYa631ih8+1BZTZPGJyOKb2mKKLKa2mNrim9riJLL4RFucRBZTW9yILG5EFlNbnEQWU2Rxoy2myGJqi5PI4kZbnEQWN9piiiymtpgii6ktpshiaospspja4kZkcdIWNyKLb2qLKbKY2mKKLKa2mCKLqS0+8bDWWusVD2uttV7xsNZa6xU/XIosTtpiiiymtrgRWUxtcdIWNyKLk7aYIouTtpgiixuRxdQWU1tMkcVJW0yRxdQWN9piiiymtpgii5O2uBFZnLTFFFncaIspsjiJLG60xUlbTJHF1BY3IotPtMUUWUxtcSOymNpiiixutMUUWXxTW0yRxdQWNx7WWmu94mGttdYrHtZaa73iz99/+EBkcdIWJ5HFSVtMkcVJW9yILKa2mCKLqS1uRBZTW0yRxdQWU2QxtcVJZDG1xRRZTG3xTZHF1BZTZPFNbXESWUxtMUUWn2iLKbL4RFtMkcVJW5xEFidtcRJZTG1xEllMbTFFFidtMUUWN9piiixO2mKKLG60xY2HtdZar3hYa631ioe11lqv+OFSZDG1xY3IYmqLk8jipC2myGJqiymyOIksTiKLG21x0hY3IouTtrgRWZy0xRRZTG0xtcVJW0yRxUlbnEQWJ20xRRZTW5xEFlNbfKItpsjipC2myOIkspja4hNtcRJZTG1xoy1O2uIksjhpiymy+E96WGut9YqHtdZar3hYa631ih++LLKY2mJqiymyeFNbnEQWU1vciCymyOKkLU7a4kZkcdIWJ5HFSVtMkcXUFieRxdQWJ5HFJyKLk8jipC2myOJGW0yRxY3IYmqLT0QWU1tMkcWNtvhEZDG1xUlkMbXFSWRxEllMbTFFFlNbfOJhrbXWKx7WWmu94mGttdYrfvhlkcXUFidtMUUWvymymNpiiiymtrjRFjcii5O2uNEWJ5HF1BZTZHHSFlNkMbXFSWRx0hZTZDG1xRRZ3GiLKbKYIotPRBYnbfGbIotPtMUUWdyILE7a4iSymNpiiiymtrjRFm96WGut9YqHtdZar3hYa631ij9//+EDkcWNtjiJLKa2mCKLT7TFSWQxtcUUWZy0xRRZnLTFSWRx0hbfFFmctMWNyGJqi5PI4qQtpshiaospspja4iSyOGmLKbKY2uIksvimtpgii0+0xRRZTG0xRRYnbXEjspjaYoosflNbTJHF1BafeFhrrfWKh7XWWq94WGut9YofvqwtbkQWU1tMkcXUFieRxUlkMbXF1BZTZDG1xRRZnLTFSWQxtcWNyGJqiymyOGmLb4osprb4RFt8U2Rx0hbfFFlMbXESWXyiLabI4kZkcRJZTG0xRRZTZDG1xSfa4iSymNpiiiymtpgii9/0sNZa6xUPa621XvGw1lrrFX/+/sMHIosbbXESWUxtcSOyOGmLKf7AwCVQAAAETElEQVSvPTi4ESTJgSDoWxghKBeloEghBeWiFnv35CuBRHXXYoAwS/HGdHESKf4m08UWKbbpYosU23SxRYptujiJFNt0sUWKG9PFjUixTRdbpPhN08UWKW5MF1uk2KaLLVJs08UWKU6mi5NIsU0XW6TYpostUvym6eIkUmzTxRsPZmb2iQczM/vEg5mZfeKff/+Pv0ik2KaLLVLcmC62SLFNFzcixcl08Uak2KaLG5Fimy62SLFNF29EijemixuRYpsutkixTRdbpLgxXdyIFCfTxX8pUpxMF1+KFCfTxY1IsU0XJ5HiZLq48WBmZp94MDOzTzyYmdkn/nApUnxputimiy1SnEwXN6aLLVLcmC5OIsXJdPFGpNimi5NI8aXp4iRSnESKbbrYpostUpxEipPpYosUJ5Fimy5OposbkeInTRc3IsU2XdyIFL8pUmzTxY1IcTJdvPFgZmafeDAzs088mJnZJ/7w0nTxkyLFSaS4ESluTBfbdHESKU4ixY1I8cZ08aVI8UakOIkU23RxEim26WKLFDcixY3p4kak2KaLLVL8TSLFNl1s08WNSHFjuvhJ08VPejAzs088mJnZJx7MzOwTf/hhkeLGdHFjungjUmzTxRYpTqaL3zRdbJHiJFK8MV1skWKLFCfTxRYpbkwXNyLFNl3cmC5uRIqTSPHGdLFFim262CLFyXRxI1Js08UWKW5MFyeRYpsuTqaLLVJskeKNSLFNF1uk2KaLNx7MzOwTD2Zm9okHMzP7xB/+cpFimy62SHESKW5Eim26eGO62CLFb5outkixTRcnkWKLFDcixTZdbJHiZLrYIsU2XWyR4o3pYosU23TxRqTYpostUpxMF1ukOJkutuniZLp4I1L8l6aLLVLcmC5+0oOZmX3iwczMPvFgZmaf+MNfbro4mS62SHEyXZxEii9NF1uk2KaLLVJs08WNSHEyXWyRYpsutkixTRcn08UWKU6miy1SbNPFjUixRYqTSLFNF1uk2KaLbbr4TdPFG5HixnRxMl3ciBTbdLFFijemi5NIcTJd3HgwM7NPPJiZ2ScezMzsE3/4YdPFlyLFNl28ESm26eJGpNimi5NIcRIptuliixRvTBdbpNimi98UKbbp4r80XWyRYpsutkixRYobkeJkutgixY1IsU0XN6aLLVKcRIqTSHFjujiZLk4ixTZdnESKbbr4SQ9mZvaJBzMz+8SDmZl94p9//48LkeJL08VJpHhjujiJFL9putgixcl0cRIpTqaLk0ixTRdbpNimi5NIcTJdbJFimy62SLFNFz8pUpxMFyeR4sZ0sUWKbbrYIsU2XdyIFNt0cRIpTqaLNyLFG9PFjUhxMl1skWKbLt54MDOzTzyYmdknHszM7BP//Pt/mJnZr3swM7NPPJiZ2ScezMzsEw9mZvaJBzMz+8SDmZl94sHMzD7xYGZmn3gwM7NPPJiZ2ScezMzsE/8DldkFs3Ik0YcAAAAASUVORK5CYII="
const provider: IProvider[] = [
  {
    id: 1,
    providerId: "2c328275-4473-4f36-8ff7-a783e755eee3",
    credential: "marta",
    name: "Matheus",
    accountId: "00000000-0000-0000-0000-000000000000",
    instanceName: "account_cd777da1-e9ae-4c3c-9fea-1e0c6ca14378",
    instanceId: "a988df3a-82ba-477b-a2ae-636d36228910",
    status: "close",
    owner: "557988209261@s.whatsapp.net",
    profileName: null,
    profilePictureUrl:
      "https://pps.whatsapp.net/v/t61.24694-24/491877600_1078109354191885_8964089973991435560_n.jpg?ccb=11-4&oh=01_Q5Aa1wEnvrSWIjaJ_3dfit6hvCdc2eoZhg2U6BhVbwoD24sUXQ&oe=6854741A&_nc_sid=5e03e0&_nc_cat=104",
  },
  {
    id: 2,
    providerId: "aeb24b9f-258d-4b2d-94df-b600d10c11d3",
    credential: "marta22222",
    name: "account_cd777da1-e9ae-4c3c-9fea-1e0c6ca14378",
    accountId: "00000000-0000-0000-0000-000000000000",
    instanceName: "account_cd777da1-e9ae-4c3c-9fea-1e0c6ca14378",
    instanceId: "a988df3a-82ba-477b-a2ae-636d36228910",
    status: "close",
    owner: "557988209261@s.whatsapp.net",
    profileName: null,
    profilePictureUrl:
      "https://pps.whatsapp.net/v/t61.24694-24/491877600_1078109354191885_8964089973991435560_n.jpg?ccb=11-4&oh=01_Q5Aa1wEnvrSWIjaJ_3dfit6hvCdc2eoZhg2U6BhVbwoD24sUXQ&oe=6854741A&_nc_sid=5e03e0&_nc_cat=104",
  },
  {
    id: 3,
    providerId: "17a7a2ea-ad5e-4f42-a988-bcb60608371d",
    credential: "dsadsadadasdasdasdasdasdasdas",
    name: "account_cd777da1-e9ae-4c3c-9fea-1e0c6ca14378",
    accountId: "00000000-0000-0000-0000-000000000000",
    instanceName: "account_cd777da1-e9ae-4c3c-9fea-1e0c6ca14378",
    instanceId: "a988df3a-82ba-477b-a2ae-636d36228910",
    status: "close",
    owner: "557988209261@s.whatsapp.net",
    profileName: null,
    profilePictureUrl:
      "https://pps.whatsapp.net/v/t61.24694-24/491877600_1078109354191885_8964089973991435560_n.jpg?ccb=11-4&oh=01_Q5Aa1wEnvrSWIjaJ_3dfit6hvCdc2eoZhg2U6BhVbwoD24sUXQ&oe=6854741A&_nc_sid=5e03e0&_nc_cat=104",
  },
  {
    id: 4,
    providerId: "8e20cf1d-ad8e-4ea3-b3de-61b017389166",
    credential: "account_cd777da1-e9ae-4c3c-9fea-1e0c6ca14378",
    name: "account_cd777da1-e9ae-4c3c-9fea-1e0c6ca14378",
    accountId: "00000000-0000-0000-0000-000000000000",
    instanceName: "account_cd777da1-e9ae-4c3c-9fea-1e0c6ca14378",
    instanceId: "a988df3a-82ba-477b-a2ae-636d36228910",
    status: "close",
    owner: "557988209261@s.whatsapp.net",
    profileName: null,
    profilePictureUrl:
      "https://pps.whatsapp.net/v/t61.24694-24/491877600_1078109354191885_8964089973991435560_n.jpg?ccb=11-4&oh=01_Q5Aa1wEnvrSWIjaJ_3dfit6hvCdc2eoZhg2U6BhVbwoD24sUXQ&oe=6854741A&_nc_sid=5e03e0&_nc_cat=104",
  },
  {
    id: 5,
    providerId: "9cf1f667-bf61-4df5-b69a-783929a07866",
    credential: "account_cd777da1-e9ae-4c3c-9fea-1e0c6ca14378",
    name: "Matheus felipe",
    accountId: "00000000-0000-0000-0000-000000000000",
    instanceName: "account_cd777da1-e9ae-4c3c-9fea-1e0c6ca14378",
    instanceId: "d2eb18da-0f79-4acf-b7d7-297085eb6da8",
    status: "open",
    owner: "557988209261@s.whatsapp.net",
    profileName: null,
    profilePictureUrl:
      "https://pps.whatsapp.net/v/t61.24694-24/491877600_1078109354191885_8964089973991435560_n.jpg?ccb=11-4&oh=01_Q5Aa1wEnvrSWIjaJ_3dfit6hvCdc2eoZhg2U6BhVbwoD24sUXQ&oe=6854741A&_nc_sid=5e03e0&_nc_cat=104",
  },
];

const pro = ref<IProvider[]>([]);
const reconectarDialog = ref(false);
const desconectarDialog = ref(false);
const editarProviderDialog = ref(false)
const addProviderDialog = ref(false)
const editedItem = ref<IProvider>(defaultItem.value);
const editedIndex = ref(-1);
const selectedRow = ref(null);

const onSelectRow = (rows: IProvider[]) => {
  if (rows.length > 1) {
    // Mantém apenas o último selecionado
    selectedRows.value = [rows[rows.length - 1]];
  }
}

const reconectarProvider = (item: IProvider) => {
  editedIndex.value = pro.value.indexOf(item);
  editedItem.value = { ...item };
  reconectarDialog.value = true;
};

const conectarProvider = (item: IProvider) => {
  editedIndex.value = pro.value.indexOf(item);
  editedItem.value = { ...item };
  desconectarDialog.value = true;
};

const editarItem = (item: IProvider) => {
  editedIndex.value = pro.value.indexOf(item);
  editedItem.value = { ...item };
  editarProviderDialog.value = true;
};

const deleteItemConfirm = () => {
  pro.value.splice(editedIndex.value, 1);
  closeDelete();
};

const close = () => {
  reconectarDialog.value = false;
  editedIndex.value = -1;
  editedItem.value = { ...defaultItem.value };
};

const closeDelete = () => {
  desconectarDialog.value = false;
  editedIndex.value = -1;
  editedItem.value = { ...defaultItem.value };
};

const providers = computed((): IProvider[] => {
  if (searchQuery.value) {
    return provider.filter((i) => {
      const matchDescricao = i.name
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase());

      return matchDescricao;
    });
  }
  return provider;
});

const widgetData = ref([
  {
    title: "In-Store Sales",
    value: "$5,345",
    icon: "tabler-smart-home",
    desc: "5k orders",
    change: 5.7,
  },
  {
    title: "Website Sales",
    value: "$674,347",
    icon: "tabler-device-laptop",
    desc: "21k orders",
    change: 12.4,
  },
  {
    title: "Discount",
    value: "$14,235",
    icon: "tabler-gift",
    desc: "6k orders",
  },
  {
    title: "Affiliate",
    value: "$8,345",
    icon: "tabler-wallet",
    desc: "150 orders",
    change: -3.5,
  },
]);

const headers = [
  { title: "Nome", key: "product", sortable: false },
  { title: "Status", key: "status", align: "center" as const, sortable: false },
  {
    title: "Ações",
    key: "actions",
    sortable: false,
    align: "center" as const,
  },
];

const selectedStatus = ref();
const selectedCategory = ref();
const selectedStock = ref<boolean | undefined>();
const searchQuery = ref("");
const selectedRows = ref<IProvider[]>([]);

const status = ref([
  { title: "Scheduled", value: "Scheduled" },
  { title: "Publish", value: "Published" },
  { title: "Inactive", value: "Inactive" },
]);

const categories = ref([
  { title: "Accessories", value: "Accessories" },
  { title: "Home Decor", value: "Home Decor" },
  { title: "Electronics", value: "Electronics" },
  { title: "Shoes", value: "Shoes" },
  { title: "Office", value: "Office" },
  { title: "Games", value: "Games" },
]);

const stockStatus = ref([
  { title: "In Stock", value: true },
  { title: "Out of Stock", value: false },
]);

// Data table options
const itemsPerPage = ref(10);
const page = ref(1);
const sortBy = ref();
const orderBy = ref();

// Update data table options
const updateOptions = (options: any) => {
  sortBy.value = options.sortBy[0]?.key;
  orderBy.value = options.sortBy[0]?.order;
};

const resolveCategory = (category: string) => {
  if (category === "Accessories")
    return { color: "error", icon: "tabler-device-watch" };
  if (category === "Home Decor") return { color: "info", icon: "tabler-home" };
  if (category === "Electronics")
    return { color: "primary", icon: "tabler-device-imac" };
  if (category === "Shoes") return { color: "success", icon: "tabler-shoe" };
  if (category === "Office")
    return { color: "warning", icon: "tabler-briefcase" };
  if (category === "Games")
    return { color: "primary", icon: "tabler-device-gamepad-2" };
};

const resolveStatus = (statusMsg: string) => {
  if (statusMsg === "conecting")
    return { text: "Conectando", color: "warning" };
  if (statusMsg === "open") return { text: "Conectado", color: "success" };
  if (statusMsg === "close") return { text: "Desconectado", color: "error" };
};

const { data: productsData, execute: fetchProducts } = await useApi<any>(
  createUrl("/apps/ecommerce/products", {
    query: {
      q: searchQuery,
      stock: selectedStock,
      category: selectedCategory,
      status: selectedStatus,
      page,
      itemsPerPage,
      sortBy,
      orderBy,
    },
  })
);

const products = computed(
  (): ECommerceProduct[] => productsData.value.products
);
const totalProduct = computed(() => productsData.value.total);

const deleteProduct = async (id: string) => {
  await $api(`apps/ecommerce/products/${id}`, {
    method: "DELETE",
  });

  // Delete from selectedRows
  // const index = selectedRows.value.findIndex((row) => row === id);
  // if (index !== -1) selectedRows.value.splice(index, 1);

  // Refetch products
  fetchProducts();
};

const $toast = useToast();
const campaignStore = useCampaignStore();

const iconsSteps = [
  {
    title: "Informações da campanha",
    icon: customWizardAccount,
  },
  {
    title: "Público-alvo",
    icon: customWizardPersonal,
  },
  {
    title: "Caixa de saída",
    icon: customWizardAddress,
  },
  {
    title: "Mensagem",
    icon: customWizardSocialLink,
  },
];
const radioContent: CustomInputContent[] = [
  {
    title: "Única",
    desc: "Envie mensagens automáticas para seus contatos de forma única.",
    value: "unica",
  },
  {
    title: "Recorrente",
    value: "recorrente",
    desc: "Envie mensagens automáticas de maneira recorrente para seus contatos.",
  },
];

const typeContacts: CustomInputContent[] = [
  {
    title: "Adicione os números de forma manual",
    desc: "Digite os números desejados manualmente para incluir novos contatos no chat.",
    value: "manual",
  },
  {
    title: " Importar planilhas",
    value: "import",
    desc: "Importe um arquivo em formato XLS, XLSX ou CSV contendo a lista de números.",
  },
];

const currentStep = ref(0);
const isCurrentStepValid = ref(true);
const loading = ref(false);
const refStepOne = ref<VForm>();
const refStepTwo = ref<VForm>();
const refSocialLinkForm = ref<VForm>();
const refAddressForm = ref<VForm>();
const fileInput = ref<HTMLInputElement | null>(null);
const shippingNumbers = ref([] as string[]);
const selectedContacts = ref("manual");
const message = ref("");
const nameProvider = ref("");

const breakMessage = [
  "A cada 5 min - Recomendado",
  "A cada 3 min",
  "A cada 2 min - Risco de banimento",
  "A cada 1 min - Alto risco de banimento",
];
const recurrencePeriod = ["Diário", "Semanal", "Mensal"];

const stepOneForm = ref({
  nameCampaign: "",
  typeCampaign: "unica",
  dataStart: "",
  dataEnd: "",
  intervalRepeat: "",
  messageBreak: "",
  startTime: "",
  endTime: "",
});

const personalForm = ref({
  firstName: "",
  lastName: "",
  country: undefined,
  language: undefined,
});

const socialForm = ref({
  twitter: "",
  facebook: "",
  googlePlus: "",
  linkedIn: "",
});

const addressForm = ref({
  address: "",
  landmark: "",
  city: "",
  pincode: "",
});

const addNumber = () => {
  var number = extractNumbers(message.value);
  if (!number) return;
  shippingNumbers.value.push(number);
  message.value = "";
};

const createProvider = () => {
  console.log("provider criaddo");
};

const validateStepOne = () => {
  refStepOne.value?.validate().then((valid) => {
    if (!valid.valid) {
      isCurrentStepValid.value = false;
      return;
    }
    if (!validateTime(stepOneForm.value.startTime, stepOneForm.value.endTime)) {
      return;
    }
    const campaign = getDetailCampaign(stepOneForm.value);
    campaignStore.setDraft(campaign);
    currentStep.value++;
    isCurrentStepValid.value = true;
  });
};

const validateStepTwo = () => {
  refStepTwo.value?.validate().then((valid) => {
    if (valid.valid) {
      campaignStore.setDraft({
        ...(campaignStore as unknown as CampaignDraft),
        numbers: shippingNumbers.value,
      });
      currentStep.value++;
      isCurrentStepValid.value = true;
    } else {
      isCurrentStepValid.value = false;
    }
  });
};

const validateAddressForm = () => {
  refAddressForm.value?.validate().then((valid) => {
    if (valid.valid) {
      currentStep.value++;
      isCurrentStepValid.value = true;
    } else {
      isCurrentStepValid.value = false;
    }
  });
};

const validateSocialLinkForm = () => {
  refSocialLinkForm.value?.validate().then((valid) => {
    if (valid.valid) {
      currentStep.value++;
      isCurrentStepValid.value = true;
    } else {
      isCurrentStepValid.value = false;
    }
  });
};

const getDetailCampaign = (obj: any): CampaignDraft => {
  return {
    campaignId: null,
    name: obj.nameCampaign,
    numbers: [],
    messages: [],
    startCampaign: convertStringForDate(obj.dataStart),
    endCampaign: convertStringForDate(obj.dataEnd),
    startTime: obj.startTime,
    timeEnd: obj.endTime,
    recurrence: obj.typeCampaign,
    intervalMessage: validateIntervalMessage(obj.messageBreak),
    intervalRepeat: validateIntervalRepeat(obj.intervalRepeat),
    providerId: null,
    accountId: null,
    status: "Draft",
  };
};

const convertStringForDate = (value: string) => {
  if (!value) {
    return;
  }
  const date = new Date(value);
  return date.toISOString();
};

const validateIntervalRepeat = (value: string) => {
  if (value == "Diário") return 1;
  if (value == "Semanal") return 7;
  if (value == "Mensal") return 30;
};

const validateIntervalMessage = (value: string) => {
  const interval = getInterval(value);
  if (interval === 5) return "00:05";
  if (interval === 3) return "00:03";
  if (interval === 2) return "00:02";
  if (interval === 1) return "00:01";
};

const getInterval = (value: string) => {
  const match = value.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
};

const validateTime = (startTime: string, endTime: string) => {
  const time1 = new Date(`1970-01-01T${startTime}:00Z`);
  const time2 = new Date(`1970-01-01T${endTime}:00Z`);
  if (endTime < startTime) {
    $toast.error("Horário de envio final não pode ser menor que inicial!!");
    return false;
  }
  const differenceInMinutes = Math.abs(
    (time2.getTime() - time1.getTime()) / 1000 / 60
  );
  if (differenceInMinutes < 60) {
    $toast.error(
      "Horário do início da campanha deve ser pelo menos 1 hora antes do fim da campanha!"
    );
    return false;
  }
  return true;
};

const extractNumbers = (inputString: string) => {
  const rawNumber = String(inputString).replace(/[^0-9]/g, "");
  if (
    rawNumber.length < 10 ||
    (rawNumber.length > 11 && !rawNumber.startsWith("55"))
  ) {
    $toast.error("Número inválido: tamanho incorreto.");
    return "";
  }
  const completeNumber = rawNumber.startsWith("55")
    ? rawNumber
    : `55${rawNumber}`;
  return completeNumber;
};

const deleteNumber = (numero: string) => {
  shippingNumbers.value = shippingNumbers.value.filter(
    (item) => item !== numero
  );
};

const handleFileUpload = (event: any) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (e: any) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const headerRow: any = jsonData[0];
    const columnIndex = headerRow.findIndex(
      (header: any) => header === "numeros"
    );

    if (columnIndex !== -1) {
      const numbers = jsonData
        .slice(1)
        .map((row: any) => row[columnIndex])
        .filter((item) => item !== undefined);
      const formattedNumbers = numbers.map((item) => extractNumbers(item));
      const validNumbers = formattedNumbers.filter((number) => number !== "");
      shippingNumbers.value.push(...validNumbers);
    } else {
      $toast.error("Coluna NUMERO não encontrada.");
    }

    if (fileInput.value) {
      fileInput.value.value = "";
    }
  };

  reader.readAsArrayBuffer(file);
};

watch(selectedContacts, () => {
  shippingNumbers.value = [];
});
</script>

<template>
  <VCard>
    <VCardText>
      <!-- 👉 Stepper -->
      <AppStepper v-model:current-step="currentStep" :items="iconsSteps" :is-active-step-valid="isCurrentStepValid"
        align="center" />
    </VCardText>

    <VDivider />

    <VCardText>
      <!-- 👉 stepper content -->

      <VWindow v-model="currentStep" class="disable-tab-transition">
        <VWindowItem>
          <!-- STEP ONE -->
          <VForm ref="refStepOne" @submit.prevent="validateStepOne">
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6 font-weight-medium">
                  Informações da campanha
                </h6>
                <p class="mb-0">
                  Preencha os dados essenciais, escolha o tipo, defina a
                  recorrência, agende os disparos e estabeleça o intervalo de
                  tempo.
                </p>
              </VCol>

              <VCol cols="12">
                <VLabel class="mb-1 text-body-2 text-wrap" style="line-height: 15px" text="TÍtulo da campanha *" />
                <AppTextField v-model="stepOneForm.nameCampaign" placeholder="" />
              </VCol>

              <VCol cols="12">
                <VLabel class="mb-1 text-body-2 text-wrap" style="line-height: 15px" text="Tipo da campanha" />
                <CustomRadios v-model:selected-radio="stepOneForm.typeCampaign" :radio-content="radioContent"
                  :grid-column="{ sm: '6', cols: '12' }" />
              </VCol>

              <VCol cols="12" md="6">
                <VLabel class="mb-1 text-body-2 text-wrap" style="line-height: 15px" text="Início da campanha *" />
                <AppDateTimePicker v-model="stepOneForm.dataStart" placeholder="DD/MM/AAAA HH:MM"
                  :config="{ enableTime: true, dateFormat: 'Y-m-d H:i' }" />
              </VCol>

              <VCol cols="12" md="6" v-if="stepOneForm.typeCampaign == 'recorrente'">
                <VLabel class="mb-1 text-body-2 text-wrap" style="line-height: 15px" text="Fim da campanha *" />
                <AppDateTimePicker v-model="stepOneForm.dataEnd" placeholder="DD/MM/AAAA HH:MM"
                  :config="{ enableTime: true, dateFormat: 'Y-m-d H:i' }" />
              </VCol>

              <VCol cols="12" md="6">
                <VLabel class="mb-1 text-body-2 text-wrap" style="line-height: 15px"
                  text=" Tempo de disparo das mensagens *" />
                <AppSelect :items="breakMessage" v-model="stepOneForm.messageBreak"
                  placeholder="Escolha o tempo de disparos das mensagens" />
              </VCol>

              <VCol cols="12" md="6" v-if="stepOneForm.typeCampaign == 'recorrente'">
                <VLabel class="mb-1 text-body-2 text-wrap" style="line-height: 15px" text=" Período de recorrência *" />
                <AppSelect :items="recurrencePeriod" placeholder="Selecione" v-model="stepOneForm.intervalRepeat" />
              </VCol>

              <VCol cols="12" md="6">
                <VLabel class="mb-1 text-body-2 text-wrap" style="line-height: 15px" text="Horário de envio *" />
                <AppDateTimePicker v-model="stepOneForm.startTime" placeholder="Selecione o horario" :config="{
                  enableTime: true,
                  noCalendar: true,
                  dateFormat: 'H:i',
                }" />
              </VCol>

              <VCol cols="12" md="6">
                <VLabel class="mb-1 text-body-2 text-wrap" style="line-height: 15px" text="" />
                <AppDateTimePicker v-model="stepOneForm.endTime" placeholder="Selecione o horario" :config="{
                  enableTime: true,
                  noCalendar: true,
                  dateFormat: 'H:i',
                }" />
              </VCol>

              <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-end mt-8">
                  <VBtn color="secondary" variant="tonal" disabled>
                    Salvar rascunho
                  </VBtn>

                  <VBtn type="submit">
                    Próximo
                    <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <VWindowItem>
          <!-- STEP TWO -->
          <VForm ref="refStepTwo" @submit.prevent="validateStepTwo">
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6 font-weight-medium">Público-alvo</h6>
                <p class="mb-0">
                  Defina a lista de contatos para onde serão enviadas as
                  mensagens da campanha.
                </p>
              </VCol>

              <VCol cols="12">
                <CustomRadios v-model:selected-radio="selectedContacts" :radio-content="typeContacts"
                  :grid-column="{ sm: '6', cols: '12' }" />
              </VCol>

              <VCol cols="12" v-if="selectedContacts == 'manual'">
                <AppTextField v-model="message" clearable label="Adicione os números." placeholder="Números para envio"
                  type="number" :hide-spin-buttons="true" class="textfield-demo-icon-slot">
                  <!-- AppendInner -->
                  <template #append-inner>
                    <VFadeTransition leave-absolute>
                      <VProgressCircular v-if="loading" color="primary" width="3" size="24" indeterminate />

                      <VNodeRenderer v-else class="text-2xl" :nodes="themeConfig.app.logo" />
                    </VFadeTransition>
                  </template>
                  <!-- Append -->
                  <template #append>
                    <VBtn :icon="$vuetify.display.smAndDown" :disabled="message.length < 12" @click="addNumber">
                      <span v-if="$vuetify.display.mdAndUp" class="ms-3">Adicionar</span>
                    </VBtn>
                  </template>
                </AppTextField>

                <VRow class="d-flex ga-2">
                  <VCol cols="12" class="mt-4 mr-1">
                    <VLabel v-if="shippingNumbers.length > 0" class="mb-1 text-body-2 text-wrap"
                      style="line-height: 10px" text="Números adicionados" />
                  </VCol>
                  <div v-for="item in shippingNumbers" :key="item" class="mb-1">
                    <VChip color="blue" text-color="white" class="ml-3" label>
                      {{ item }}
                      <VIcon @click="deleteNumber(item)" size="x-small" icon="tabler-x" />
                    </VChip>
                  </div>
                </VRow>
              </VCol>

              <VCol cols="12" v-if="selectedContacts == 'import'">
                <VFileInput label=" Clique aqui para escolher um arquivo" density="compact" ref="fileInput"
                  @change="handleFileUpload" />
                <VLabel class="mt-5 text-body-2 text-wrap" style="line-height: 15px" text="Obs: Permitido arquivos .csv ou .xlsx(Exel) com a coluna
              'numeros'." />

                <VRow class="d-flex ga-2">
                  <VCol cols="12" class="mt-4 mr-1">
                    <VLabel v-if="shippingNumbers.length > 0" class="mb-1 text-body-2 text-wrap"
                      style="line-height: 10px" text="Números adicionados" />
                  </VCol>
                  <div v-for="item in shippingNumbers" :key="item" class="mb-1">
                    <VChip color="blue" text-color="white" class="ml-1" label>
                      {{ item }}
                      <VIcon @click="deleteNumber(item)" size="x-small" icon="tabler-x" />
                    </VChip>
                  </div>
                </VRow>
              </VCol>

              <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-space-between mt-8">
                  <VBtn color="secondary" variant="tonal" @click="currentStep--">
                    <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                    Voltar
                  </VBtn>

                  <div class="d-flex gap-4">
                    <VBtn color="secondary" variant="tonal">
                      Salvar rascunho
                    </VBtn>

                    <VBtn type="submit">
                      Próximo
                      <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
                    </VBtn>
                  </div>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <VWindowItem>
          <VForm ref="refAddressForm" @submit.prevent="validateAddressForm">
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6 font-weight-medium">Caixa de saída</h6>
                <p class="mb-0">
                  Escolha a caixa de saída que será utilizada para enviar
                  mensagens
                </p>
              </VCol>

              <VCol cols="12" v-if="!products.length">
                <AppTextField v-model="nameProvider" clearable label="Nome da caixa."
                  placeholder="Insira um nome para caixa de saída" type="text" :hide-spin-buttons="true"
                  class="textfield-demo-icon-slot" :rules="[requiredValidator]">
                  <!-- Append -->
                  <template #append>
                    <VBtn :icon="$vuetify.display.smAndDown" @click="createProvider">
                      <span class="ms-3">Criar caixa</span>
                    </VBtn>
                  </template>
                </AppTextField>
              </VCol>

              <VCol cols="12">
                <VDivider />

                <div class="d-flex flex-wrap gap-4 ma-6">
                  <div class="d-flex align-center">
                    <!-- 👉 Search  -->
                    <AppTextField v-model="searchQuery" placeholder="Pesquise conexão" style="inline-size: 500px"
                      class="me-3" />
                  </div>

                  <VSpacer />
                  <div class="d-flex gap-4 flex-wrap align-center">
                    <VBtn color="primary" prepend-icon="tabler-plus" @click="addProviderDialog = true">
                      Nova conexão
                    </VBtn>
                  </div>
                </div>

                <VDivider class="mt-4" />

                <!-- 👉 Datatable  -->
                <VDataTableServer v-model:items-per-page="itemsPerPage" v-model:model-value="selectedRows"
                  v-model:page="page" :headers="headers" :items="providers" :items-length="totalProduct" return-object
                  show-select class="text-no-wrap" @update:model-value="onSelectRow" @update:options="updateOptions">
                  <!-- product  -->
                  <template #item.product="{ item }">
                    <div class="d-flex align-center gap-x-4">
                      <VAvatar v-if="item.profilePictureUrl" size="38" variant="tonal" rounded
                        :image="item.profilePictureUrl" />
                      <div class="d-flex flex-column">
                        <span class="text-body-1 font-weight-medium text-high-emphasis">{{ item.name }}</span>
                        <span class="text-body-2">{{
                          item.owner ?? "Desconectado"
                        }}</span>
                      </div>
                    </div>
                  </template>

                  <!-- category -->
                  <!-- <template #item.category="{ item }">
                    <VAvatar size="30" variant="tonal" :color="resolveCategory(item.category)?.color" class="me-4">
                      <VIcon :icon="resolveCategory(item.category)?.icon" size="18" />
                    </VAvatar>
                    <span class="text-body-1 text-high-emphasis">{{ item.category }}</span>
                  </template> -->

                  <!-- stock -->
                  <!-- <template #item.stock="{ item }">
                    <VSwitch :model-value="item.stock" />
                  </template> -->

                  <!-- status -->
                  <template #item.status="{ item }">
                    <VChip v-bind="resolveStatus(item.status)" density="default" label size="small" />
                  </template>

                  <!-- Actions -->
                  <template #item.actions="{ item }">
                    <IconBtn @click="editarItem(item)">
                      <VIcon icon="tabler-edit" />
                    </IconBtn>

                    <IconBtn>
                      <VIcon icon="tabler-dots-vertical" />
                      <VMenu activator="parent">
                        <VList>
                          <VListItem v-if="item.status == `close`" value="download" prepend-icon="tabler-refresh"
                            @click="reconectarProvider(item)">
                            Reconectar
                          </VListItem>
                          <VListItem v-else value="download" prepend-icon="tabler-refresh-off"
                            @click="conectarProvider(item)">
                            Desconectar
                          </VListItem>
                        </VList>
                      </VMenu>
                    </IconBtn>
                  </template>

                  <!-- pagination -->
                  <template #bottom>
                    <TablePagination v-model:page="page" :items-per-page="itemsPerPage" :total-items="totalProduct" />
                  </template>
                </VDataTableServer>
              </VCol>

              <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-space-between mt-8">
                  <VBtn color="secondary" variant="tonal" @click="currentStep--">
                    <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                    Voltar
                  </VBtn>

                  <div class="d-flex gap-4">
                    <VBtn color="secondary" variant="tonal">
                      Salvar rascunho
                    </VBtn>

                    <VBtn type="submit">
                      Próximo
                      <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
                    </VBtn>
                  </div>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <VWindowItem>
          <VForm ref="refSocialLinkForm" @submit.prevent="validateSocialLinkForm">
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6 font-weight-medium">Mensagem</h6>
                <p class="mb-0">
                  Escreva a mensagem que será enviada na campanha. Pode
                  adicionar arquivos, emojis, entre outras personalizações,
                  semelhante as mensagens do WhatsApp.
                </p>
              </VCol>

              <VCol cols="12">
                <MessageComponent />
              </VCol>

              <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-space-between mt-8">
                  <VBtn color="secondary" variant="tonal" @click="currentStep--">
                    <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                    Voltar
                  </VBtn>

                  <div class="d-flex gap-4">
                    <VBtn color="secondary" variant="tonal">
                      Salvar rascunho
                    </VBtn>

                    <VBtn type="submit" :disabled="campaignStore.getDraft.messages.length === 0">
                      Criar campanha
                      <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
                    </VBtn>
                  </div>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <VWindowItem>
          <div class="text-base">
            <h6 class="text-base font-weight-medium mb-2">Account</h6>

            <p class="mb-1">
              {{ stepOneForm.nameCampaign }}
            </p>
            <p class="mb-1">
              {{ stepOneForm.nameCampaign }}
            </p>

            <VDivider class="my-4" />

            <h6 class="text-base font-weight-medium mb-2">Personal Info</h6>

            <p class="mb-1">
              {{ personalForm.firstName }}
            </p>
            <p class="mb-1">
              {{ personalForm.lastName }}
            </p>
            <p class="mb-1">
              {{ personalForm.country }}
            </p>
            <p class="mb-1">
              {{ personalForm.language }}
            </p>

            <VDivider class="my-4" />

            <h6 class="text-base font-weight-medium mb-2">Address</h6>

            <p class="mb-1">
              {{ addressForm.address }}
            </p>
            <p class="mb-1">
              {{ addressForm.landmark }}
            </p>
            <p class="mb-1">
              {{ addressForm.pincode }}
            </p>
            <p class="mb-1">
              {{ addressForm.city }}
            </p>

            <VDivider class="my-4" />

            <h6 class="text-base font-weight-medium mb-2">Social Links</h6>

            <p class="mb-1">
              {{ socialForm.twitter }}
            </p>
            <p class="mb-1">
              {{ socialForm.facebook }}
            </p>
            <p class="mb-1">
              {{ socialForm.googlePlus }}
            </p>
            <p class="mb-1">
              {{ socialForm.linkedIn }}
            </p>
          </div>
          <VCol cols="12">
            <div class="d-flex flex-wrap gap-4 justify-space-between mt-8">
              <VBtn color="secondary" variant="tonal" :disabled="currentStep === 0" @click="currentStep--">
                <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                Voltar
              </VBtn>

              <VBtn color="success" @click="console.log('Form Submitted')">
                submit
              </VBtn>
            </div>
          </VCol>
        </VWindowItem>
      </VWindow>
    </VCardText>

    <!-- Reconetar Dialog -->
    <VDialog :width="$vuetify.display.smAndDown ? 'auto' : 600" v-model="reconectarDialog" max-width="600px" persistent>
      <DialogCloseBtn @click="reconectarDialog = false" />
      <VCard title="Reconectar conexão">
        <VDivider />
        <VCardText class="d-flex justify-center py-6">
          <img :src="img" alt="QR Code para reconexão" class="rounded elevation-2" />
        </VCardText>
        <p class="text-caption text-center text-medium-emphasis mt-2">
          Escaneie o QR Code com o WhatsApp para reconectar sua conta.
        </p>
      </VCard>
    </VDialog>


    <!-- Desconectar Dialog -->
    <ConfirmDialog v-model:is-dialog-visible="desconectarDialog"
      confirmation-question="Tem certeza de que deseja desconectar esta conexão?" confirm-title="Desconectado!"
      confirm-msg="A conexão foi desconectada com sucesso." cancel-title="Cancelado"
      cancel-msg="A ação de desconectar a conexão foi cancelada." />


    <!-- Editar provider -->
    <VDialog :width="$vuetify.display.smAndDown ? 'auto' : 600" v-model="editarProviderDialog" max-width="600px">
      <DialogCloseBtn @click="editarProviderDialog = false" />
      <VCard title="Editar Conexão">
        <VCardText>
          <VCol cols="12">
            <AppTextField label="Informe nome da conexão *" placeholder="Nome" :rules="[requiredValidator]"
              v-model="editedItem.name" />
          </VCol>

          <div class="self-align-end d-flex gap-2 justify-end mt-3 mb-1">
            <VBtn color="error" variant="outlined" @click="editarProviderDialog = false">
              Cancelar
            </VBtn>
            <VBtn type="submit" @click="editarProviderDialog = false"> Salvar </VBtn>
          </div>
        </VCardText>
      </VCard>
    </VDialog>

    <!-- Add provider -->
    <VDialog :width="$vuetify.display.smAndDown ? 'auto' : 600" v-model="addProviderDialog" max-width="600px">
      <DialogCloseBtn @click="addProviderDialog = false" />
      <VCard title="Adicionar nova Conexão">
        <VCardText>
          <VCol cols="12">
            <AppTextField label="Informe nome da conexão *" placeholder="Nome" :rules="[requiredValidator]" />
          </VCol>

          <div class="self-align-end d-flex gap-2 justify-end mt-3 mb-1">
            <VBtn color="error" variant="outlined" @click="addProviderDialog = false">
              Cancelar
            </VBtn>
            <VBtn type="submit" @click="addProviderDialog = false"> Salvar </VBtn>
          </div>
        </VCardText>
      </VCard>
    </VDialog>
  </VCard>
</template>
