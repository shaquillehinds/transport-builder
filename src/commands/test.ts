import restTansportInjector from "./transport.command/restTransport.injector";

restTansportInjector;

const injections = { restTansportInjector };

async function runInjections() {
  await injections.restTansportInjector({ name: "machine" });
}
runInjections();

export default injections;
