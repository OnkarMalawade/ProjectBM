import api from "./apiInstance";

export const getBidsForProject = (projectId) =>
    api.get(`/bids/project/${projectId}`);

export const acceptBid = (bidId) =>
    api.patch(`/bids/${bidId}/accept`);

export const getFreelancerAcceptedBids = () =>
    api.get("/bids/freelancer/accepted");

export const submitBid = (data) =>
    api.post("/bids", data);