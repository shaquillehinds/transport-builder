import MainTransport from "./REST/main";
const transports = {
  // add the server url for this transport
  main: new MainTransport(""),
};

export default transports;
