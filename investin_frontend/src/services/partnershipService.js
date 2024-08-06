import axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get('token');


export const   fetchRaisedPartnershipRequests = async (id) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/partnerships/raised/${id}`,{
      withCredentials:true
    });
    return response.data.result;
  } catch (error) {
    console.error('Error fetching partnership requests:', error);
    throw error;
  }
};
export const fetchPendingPartnershipRequests = async (id) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/partnerships/pending/${id}`,{
      withCredentials:true
    });
    return response.data.result;
  } catch (error) {
    console.error('Error fetching partnership requests:', error);
    throw error;
  }
};

export const acceptedPartnershipRequest = async (id) => {
  try {
    const response = await axios.put(`http://localhost:3000/api/partnerships/accepted/${id}`,{
      withCredentials:true
    });
    return response.data.result;
  } catch (error) {
    console.error('Error accepting partnership request:', error);
    throw error;
  }
};

export const rejectedPartnershipRequest = async (id) => {
  try {
    const response = await axios.put(`http://localhost:3000/api/partnerships/api/partnerships/rejected/${id}`,{
      withCredentials:true
    });
    return response.data.result;
  } catch (error) {
    console.error('Error rejecting partnership request:', error);
    throw error;
  }
};