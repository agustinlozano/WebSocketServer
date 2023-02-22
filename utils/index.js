function normalize (msMessage) {
  const { code, projectid } = msMessage
  
  const validCode = code.trim()
  const validProjectId = projectid.trim()

  return {
    code: validCode,
    projectid: validProjectId,
  } 
}

module.exports = { normalize }
