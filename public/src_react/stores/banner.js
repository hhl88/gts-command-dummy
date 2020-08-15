const banner = () => {
  try {
    return window.BANNER;
  } catch (e) {
    return {};
    console.log(e);
  }
};

export default banner;
