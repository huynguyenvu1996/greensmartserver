module.exports.Model = {
  RAIN: {
    title: 'Mưa rồi zolo thôi!',
    subject: 'Trời đang mưa',
    content: 'Trời đang mưa. Bạn nên thu dọn nông sản.',
  },
  TEMPERATURE: {
    title: 'Nhiet do!',
    subject: '',
    content: '',
  },
  HUMIDITY: {
    title: 'Do am!',
    subject: '',
    content: 'Độ ẩm không phù hợp',
  },
  COMMON: (agricultural) => {
    const content = `Thời tiết không phù hợp, bạn nên chú ý đến một số sản phẩm sau: ${agricultural.toString()}`
    return {
      title: 'Thời tiết không phù hợp',
      subject: 'Thời tiết không phù hơp để phơi nông sản',
      content: content,
    }
  },
}