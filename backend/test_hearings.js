const axios = require('axios');

async function testHearings() {
    try {
        console.log('1. Fetching available cases...');
        const casesRes = await axios.get('http://localhost:4000/api/v1/court/cases');
        const cases = casesRes.data.cases;
        
        if (cases.length === 0) {
            console.log('No court cases available for testing hearings.');
            return;
        }
        
        const testCase = cases[0];
        console.log(`Using Court Case: ${testCase.caseNumber}`);

        console.log('\n2. Scheduling a new Hearing...');
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        let hearingRes = await axios.post('http://localhost:4000/api/v1/court/hearing', {
            caseId: testCase._id,
            hearingDate: tomorrow.toISOString(),
            courtName: 'High Court Test Division',
            status: 'Scheduled',
            notes: 'Test hearing from automation script',
            userId: 'CourtStaffTest',
            userName: 'test@court.com'
        });
        
        const newHearingId = hearingRes.data.hearing._id;
        console.log(`Successfully scheduled hearing: ${newHearingId}`);

        console.log('\n3. Updating Hearing Status...');
        hearingRes = await axios.put(`http://localhost:4000/api/v1/court/hearing/${newHearingId}/status`, {
            status: 'Postponed',
            notes: 'Postponed due to test logic',
            userId: 'CourtStaffTest',
            userName: 'test@court.com'
        });
        console.log(`Successfully updated status to: ${hearingRes.data.hearing.status}`);

        console.log('\n4. Fetching all Hearings to verify relation...');
        const allHearingsRes = await axios.get('http://localhost:4000/api/v1/court/hearings');
        const matches = allHearingsRes.data.hearings.filter(h => h._id === newHearingId);
        console.log(`Found ${matches.length} matching hearing in the list response.`);

        console.log('\n5. Deleting the Test Hearing...');
        await axios.delete(`http://localhost:4000/api/v1/court/hearing/${newHearingId}`);
        console.log(`Successfully deleted hearing: ${newHearingId}`);

        console.log('\nAll tests passed successfully!');
    } catch (e) {
        console.error('TEST FAILED:', e.response ? e.response.data : e.message);
    }
}

testHearings();
