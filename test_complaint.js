async function testComplaint() {
    try {
        console.log("Starting test...");
        
        const registerResponse = await fetch('http://localhost:4000/api/v1/user', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: 'Test User',
                email: 'testusercomplaint1@gmail.com',
                passwordHash: 'password123',
                phone: '1234567890',
                city: 'Test City',
                question1: 'q1',
                question2: 'q2',
            })
        });
        
        console.log("Register response:", registerResponse.status);
        
        const loginResponse = await fetch('http://localhost:4000/api/v1/user/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: 'testusercomplaint1@gmail.com',
                password: 'password123'
            })
        });
        const loginData = await loginResponse.json();
        const token = loginData.token;
        console.log("Login token obtained:", !!token);
        
        const formData = {
            useremail: 'testusercomplaint1@gmail.com',
            name: 'Test Complaint',
            mobile: '1234567890',
            address: 'Test Addr',
            district: 'Idukki',
            location: 'Test Loc',
            department: 'Cyber Bullying',
            writecomplaint: 'Testing complaint failure...',
        };
        
        const response = await fetch('http://localhost:4000/api/v1/complaint/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log("Success! Data:", JSON.stringify(data).substring(0, 100));
        } else {
            const text = await response.text();
            console.log("Failed! Status:", response.status, "Message:", text);
        }
    } catch (e) {
        console.error("Script error:", e);
    }
}
testComplaint();
