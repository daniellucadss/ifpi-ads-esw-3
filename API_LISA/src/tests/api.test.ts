import axios from 'axios';

const API_URL = 'http://localhost:3000';
let authToken: string;

async function testAPI() {
  try {
    // Test user registration
    console.log('\nTesting user registration...');
    const registerResponse = await axios.post(`${API_URL}/auth/register`, {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Registration successful:', registerResponse.data);

    // Test user login
    console.log('\nTesting user login...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    authToken = loginResponse.data.token;
    console.log('Login successful, token received');

    // Test adding a favorite hospital
    console.log('\nTesting add favorite...');
    const favoriteResponse = await axios.post(
      `${API_URL}/favorites`,
      {
        hospitalId: 'test_hospital_id'
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    console.log('Favorite added:', favoriteResponse.data);

    // Test getting user favorites
    console.log('\nTesting get favorites...');
    const getFavoritesResponse = await axios.get(
      `${API_URL}/favorites/user`,
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    console.log('User favorites:', getFavoritesResponse.data);

    // Test adding a comment
    console.log('\nTesting add comment...');
    const commentResponse = await axios.post(
      `${API_URL}/comments`,
      {
        hospitalId: 'test_hospital_id',
        text: 'Great hospital!',
        rating: 5
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    console.log('Comment added:', commentResponse.data);

    // Test getting hospital comments
    console.log('\nTesting get hospital comments...');
    const getCommentsResponse = await axios.get(
      `${API_URL}/comments/hospital/test_hospital_id`,
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    console.log('Hospital comments:', getCommentsResponse.data);

  } catch (error: any) {
    console.error('Error during testing:', error.response?.data || error.message);
  }
}

// Add the test script to package.json
testAPI(); 