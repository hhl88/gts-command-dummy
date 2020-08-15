import moment from 'moment';

function formatNumber(x_) {
  const x = x_ ? x_ : '';
  const parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return parts.join('.');
}

const helpers = {
  getName: (e) => `${e.man} | ${e.model}`,
  getPrice: (e) => {
    return formatNumber(e.price);
  },

  getImageNews: (e) => {
    //const res = `/news/news${e.id}${e.pics[0]}`;
    return '';
  },

  getDesc: (e) => {
    return e.desc.slice(0, 650);
  },

  getRegistry: (e) => {
    const res = e.spec.condition === 'Gebrauchtfahrzeug' ? moment(e.reg).format('YYYY/MM') : '-';
    return res;
  },

  getKm: (e) => {
    const res = e.spec.condition === 'Gebrauchtfahrzeug' ? (e.spec.mileage ? formatNumber(e.spec.mileage) + 'KM' : '-') : '-';
    return res;
  },

  getFuel: (e) => {
    const res = e.spec.fuel ? e.spec.fuel : '-';
    return res;
  },

  getPower: (e) => {
    const res = e.spec.power ? (e.spec.power + 'kW' + ' (' + Math.ceil(e.spec.power * 1.35) + ' PS)') : '-';
    return res;
  },

  getCat: (e) => {
    const res = e.cat;
    return res;
  },

  getLink: (e) => `/fahrzeug/${e.linkId}`,
  getImage: (e, size) => {
    let l;
    if (e.images.main) {
      l = e.images.main[size];
    } else {
      l = '/assets/nopic.png';
    }

    return l;
  },
};

export default helpers;
