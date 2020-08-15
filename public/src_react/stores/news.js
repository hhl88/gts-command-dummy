const news = () => {
  try {
    return window.NEWS;
  } catch (e) {
    return [];
    console.log(e);
  }
};

export default news;
