const axios = require("axios");

const data = {
  ssml: `<speak><p>
  Phật đã dạy 5 lý do để làm giàu.!

Một thời, Đức Phật đã nói với đệ tử của Ngài rằng có 5 lý do để làm giàu và gây dựng gia sản, miễn là ta phải nỗ lực tinh tấn, kiếm tiền bằng đôi bàn tay, mồ hôi, công sức, tuân thủ pháp luật và chánh pháp.!

1. Làm giàu để đem an lạc và hạnh phúc cho chính mình. Làm cho cha mẹ, vợ con, nhân viên và người lao động được an lạc và hạnh phúc. Đây là lý do quan trọng nhất để gây dựng tài sản.!

2. Làm giàu để đem hạnh phúc đến cho bạn bè và người thân. Đây là lý do thứ hai để gây dựng tài sản.!

3. Làm giàu để khi gặp khó khăn và tai họa, ta vẫn còn tài sản dư giả để duy trì và khôi phục lại cuộc sống. Đây là lý do thứ ba để gây dựng tài sản.!

4. Làm giàu để ta có thể hiến cúng cho bà con, khách mời, người đã khuất; hiến cúng cho quốc gia và các vị thần. Đây là lý do thứ tư để gây dựng tài sản.!

5. Làm giàu để ta có thể tổ chức các buổi lễ cúng dường cho các vị thần và linh đạo. Sự cúng dường trang nghiêm này sẽ mang lại phước báo vô hạn trong cõi người và cõi trời. Đây là lý do thứ năm để gây dựng tài sản.!

Chúng ta cầu nguyện cho chính mình và tất cả chúng sinh trong đời này và sau này được ứng dụng Chánh pháp, lan toả Chánh pháp khắp mọi nơi và giác ngộ giải thoát. Chúng ta cầu nguyện cho tất cả mọi người có được đúng đắn trong việc làm giàu và phục vụ theo 5 nguyên tắc trên.!

NAM MÔ BỔN SƯ THÍCH CA MÂU PHẬT
  
  </p></speak>`,
  voice: "vi-VN-NamMinhNeural",
  globalSpeed: "80%",
  globalVolume: "+0dB",
  pronunciations: [],
  platform: "dashboard",
};

const config = {
  method: "post",
  url: "https://tts.toptop.wtf/playht/transcribe/beta",
  headers: {
    "Content-Type": "application/json",
  },
  data: data,
};

axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
