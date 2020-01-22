import { Injectable } from '@angular/core';
import { Constants } from '../shared/constants';
import { ApiResponse } from '../shared/apiResponse.model';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const API_KEY = environment.API_KEY;

@Injectable()
export class HttpService {

  private apiUrls = Constants;
  constructor(private http: HttpClient) { }

  imageUpload = (image) => {
    return this.http.post<ApiResponse>(`${API_KEY}/${this.apiUrls.ROUTES.IMAGE_UPLOAD}`, image);
  }
  
  checkUser = (data) => {
    return this.http.post<ApiResponse>(`${API_KEY}/${this.apiUrls.ROUTES.USER_SIGNUP_CHECK}`, data);
  }

  imageUploadCloud = (image) => {
    return this.http.post<ApiResponse>(`${API_KEY}/${this.apiUrls.ROUTES.IMAGE_UPLOAD_CLOUD}`, image);
  }

  verifyCaptcha = (resp, key) => {
    return this.http.post<ApiResponse>(`${API_KEY}/${this.apiUrls.ROUTES.VERIFY_CAPTCHA}`, {key, resp});
  }

  sendOtpToUser = (phone) => {
    return this.http.post<ApiResponse>(`${API_KEY}/${this.apiUrls.ROUTES.SEND_OTP}`, {phone});
  }

  cancelOtpPreReq = (reqId) => {
    return this.http.post<ApiResponse>(`${API_KEY}/${this.apiUrls.ROUTES.CANCEL_OTP_REQ}`, {reqId});
  }

  verifyOTP = (reqId, otp) => {
    return this.http.post<ApiResponse>(`${API_KEY}/${this.apiUrls.ROUTES.VERIFY_OTP}`, { reqId, otp });
  }
  
  addUserToDB = (data) => {
    return this.http.post<ApiResponse>(`${API_KEY}/${this.apiUrls.ROUTES.ADD_USER_BY_GOOGLE_SIGNUP}`,data);
  }

  userSignup = (userData) => {
    return this.http.post<ApiResponse>(`${API_KEY}/${this.apiUrls.ROUTES.USER_SIGNUP}`, userData);
  }

  userLogin = (userData) => {
    return this.http.post<ApiResponse>(`${API_KEY}/${this.apiUrls.ROUTES.USER_LOGIN}`, userData);
  }

  userForgotPwd = (email) => {
    return this.http.post<ApiResponse>(`${API_KEY}/${this.apiUrls.ROUTES.USER_FORGOT_PWD}`, {email});
  }

  getUserProfile = () => {
    return this.http.get<ApiResponse>(`${API_KEY}/${this.apiUrls.ROUTES.USER_PROFILE}`);
  }

  getUserByName = (data) => {
    return this.http.post<ApiResponse>(`${API_KEY}/${this.apiUrls.ROUTES.USER_BY_NAME}`, data);
  }

  updateUserData = (userData) => {
    return this.http.post<ApiResponse>(`${API_KEY}/${this.apiUrls.ROUTES.USER_UPDATE_PROFILE}`, userData);
  }

  addNewPost = (postData) => {
    return this.http.post<ApiResponse>(`${API_KEY}/${this.apiUrls.ROUTES.ADD_NEW_POST}`, postData);
  }

  getAllPosts = () => {
    return this.http.get<ApiResponse>(`${API_KEY}/${this.apiUrls.ROUTES.GET_ALL_POSTS}`);
  }

  postLiked = (data) => {
    return this.http.post<ApiResponse>(`${API_KEY}/${this.apiUrls.ROUTES.POST_LIKED}`, data);
  }

  postComment = (data) => {
    return this.http.post<ApiResponse>(`${API_KEY}/${this.apiUrls.ROUTES.POST_COMMENT}`, data);
  }

  getAllComments = (data) => {
    return this.http.post<ApiResponse>(`${API_KEY}/${this.apiUrls.ROUTES.GET_ALL_COMMENTS}`, data);
  }

  getAllUsers = () => {
    return this.http.get<ApiResponse>(`${API_KEY}/${this.apiUrls.ROUTES.GET_ALL_USERS}`);
  }

  followUser = (data) => {
    return this.http.post<ApiResponse>(`${API_KEY}/${this.apiUrls.ROUTES.FOLLOW_USER}`, data);
  }

  unfollowUser = (data) => {
    return this.http.post<ApiResponse>(`${API_KEY}/${this.apiUrls.ROUTES.UNFOLLOW_USER}`, data);
  }

  clearNotification = (id, deleteNoification?) => {
    return this.http.post<ApiResponse>(`${API_KEY}/${this.apiUrls.ROUTES.CLEAR_NOTIFICATION}`, { id, deleteNoification });
  }

  markAllAsRead = () => {
    return this.http.post<ApiResponse>(`${API_KEY}/${this.apiUrls.ROUTES.MARK_ALL_NOTIFICATION}`, {});
  }

  markChatMsgs = (sender, receiver) => {
    return this.http.post<ApiResponse>(`${API_KEY}/${this.apiUrls.ROUTES.MARK_CHAT_MSGS}/${sender}/${receiver}`, {});
  }

  sendChatMessage = (senderId, senderName, receiverId, recName, msg) => {
    // tslint:disable-next-line: max-line-length
    return this.http.post<ApiResponse>(`${API_KEY}/${this.apiUrls.ROUTES.SEND_CHAT_MSG}/${senderId}/${receiverId}`, {senderName, recName, msg});
  }

  getChatMessage = (senderId, receiverId) => {
    return this.http.get<ApiResponse>(`${API_KEY}/${this.apiUrls.ROUTES.GET_CHAT_MSG}/${senderId}/${receiverId}`);
  }

  markAllMsgsAsRead = (receiver) => {
    return this.http.post<ApiResponse>(`${API_KEY}/${this.apiUrls.ROUTES.MARK_ALL_CHAT_MSG}/${receiver}`, {});
  }

  paymentCheckout = (paymentId, payerId) => {
    return this.http.post<ApiResponse>(`${API_KEY}/${this.apiUrls.ROUTES.PAYMENT_CHECKOUT}`, {paymentId, payerId});
  }

  paytmCheckout = (amt) => {
    return this.http.post<ApiResponse>(`${API_KEY}/${this.apiUrls.ROUTES.PAYTM_PAYMENT_CHECKOUT}`, {amt});
  }

  paymentSuccess = () => {
    return this.http.get<ApiResponse>(`${API_KEY}/${this.apiUrls.ROUTES.PAYMENT_SUCCESS}`);
  }

  filterFollower = (text) => {
    return this.http.post<ApiResponse>(`${API_KEY}/${this.apiUrls.ROUTES.FILTER_FOLLOWER}`,{text});
  }

}
