module.exports.Model = {
  RAIN: {
    TITLE: 'Co Mua!',
    SUBJECT: '',
    CONTENT: '',
  },
  TEMPERATURE: {
    TITLE: 'Nhiet do!',
    SUBJECT: '',
    CONTENT: '',
  },
  HUMIDITY: {
    TITLE: 'Do am!',
    SUBJECT: '',
    CONTENT: '',
  },
  COMMON: (agricultural) => {
    const content = `Thời tiết không phù hợp, bạn nên chú ý đến một số sản phẩm sau: ${agricultural.toString()}`
    return {
      TITLE: 'Thời tiết không phù hợp',
      SUBJECT: 'Thời tiết không phù hơp để phơi nông sản',
      CONTENT: content,
    }
  },
}