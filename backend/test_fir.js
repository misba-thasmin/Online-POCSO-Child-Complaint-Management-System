const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function test() {
  try {
    const form = new FormData();
    form.append('firNumber', 'FIR-2026-0050');
    form.append('complaintId', '6673ff6b175e65533144e357');
    form.append('policeStation', 'Thrissur Town');
    form.append('investigatorName', 'SI Anoop');
    form.append('userId', 'CourtStaff');
    form.append('userName', 'court@admin.com');
    
    fs.writeFileSync('test.webp', 'dummy-data-bytes');
    form.append('document', fs.createReadStream('test.webp'));
    
    console.log("Sending Request to http://localhost:4000/api/v1/court/fir...");
    const res = await axios.post('http://localhost:4000/api/v1/court/fir', form, {headers: form.getHeaders()});
    console.log('SUCCESS:', res.data);
  } catch(e) {
    if (e.response) {
      fs.writeFileSync('error_out.txt', JSON.stringify(e.response.data, null, 2));
    } else {
      fs.writeFileSync('error_out.txt', e.message);
    }
  }
}
test();
