function errHandle(res, err) {
  res.status(400).json({
    status: "false",
    message: "此id不存在，或欄位資料錯誤",
    error: err,
  });
}

module.exports = errHandle;
