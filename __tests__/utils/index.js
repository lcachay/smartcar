// Mock request and response objects for testing handlers
const createMockReq = (params = {}, body = {}) => ({
  params,
  body,
});

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

module.exports = {
  createMockReq,
  createMockRes,
};
