import type { VerticalNavItems } from "@layouts/types";
//import appsAndPages from "./apps-and-pages";
import campaigns from "./campaigns";
import contacts from "./contacts";
import grupoContato from "./grupo-contato";
// import charts from "./charts";
// import dashboard from "./dashboard";
// import forms from "./forms";
// import others from "./others";
// import uiElements from "./ui-elements";

// export default [
//   ...dashboard,
//   ...appsAndPages,
//   ...uiElements,
//   ...forms,
//   ...charts,
//   ...others,
//   ...campaigns,
// ] as VerticalNavItems;
export default [...campaigns, ...contacts, ...grupoContato] as VerticalNavItems;
