const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function testCases() {
    try {
        console.log('1. Fetching FIRs...');
        const firsRes = await axios.get('http://localhost:4000/api/v1/court/firs');
        const firs = firsRes.data.firs;
        if (firs.length === 0) {
            console.log('No FIRs available to create a case from.');
            return;
        }

        const testFir = firs[0];
        console.log(`Using FIR: ${testFir.firNumber}`);

        console.log('\n2. Creating a new Case...');
        const caseNumber = 'TEST-CC-' + Math.floor(Math.random() * 10000);
        const validComplaintId = (testFir.complaintId && testFir.complaintId._id) ? testFir.complaintId._id : '6673ff6e175e65533144e359';
        let caseRes = await axios.post('http://localhost:4000/api/v1/court/case', {
            caseNumber: caseNumber,
            complaintId: validComplaintId,
            courtName: 'High Court Test',
            judgeName: 'Hon. Justice Smith',
            status: 'Pending',
            userId: 'CourtStaffTest',
            userName: 'test@court.com'
        });
        
        const newCaseId = caseRes.data.courtCase._id;
        console.log(`Successfully created case: ${newCaseId}`);

        console.log('\n3. Updating Case Details...');
        caseRes = await axios.put(`http://localhost:4000/api/v1/court/case/${newCaseId}/details`, {
            judgeName: 'Hon. Justice Doe',
            status: 'Active',
            userId: 'CourtStaffTest',
            userName: 'test@court.com'
        });
        console.log(`Successfully updated details. New Judge: ${caseRes.data.courtCase.judgeName}`);

        console.log('\n4. Uploading Judgment...');
        fs.writeFileSync('test_judgment.pdf', 'dummy pdf content for judgment');
        const form = new FormData();
        form.append('verdict', 'Guilty');
        form.append('punishment', '10 Years');
        form.append('date', new Date().toISOString());
        form.append('userId', 'CourtStaffTest');
        form.append('userName', 'test@court.com');
        form.append('document', fs.createReadStream('test_judgment.pdf'));

        const currentRes = await axios.put(`http://localhost:4000/api/v1/court/case/${newCaseId}/judgment`, form, { headers: form.getHeaders() });
        console.log(`Successfully uploaded judgment. Document Path: ${currentRes.data.courtCase.judgment.documentPath}`);
        
        console.log('\nAll tests passed successfully!');
    } catch (e) {
        console.error('TEST FAILED:', e.response ? e.response.data : e.message);
    }
}
testCases();
