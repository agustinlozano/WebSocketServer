function normalize (msMessage) {
  const { code, projectid } = msMessage

  if (!code || !projectid) return null
  
  const validCode = code.trim()
  const validProjectId = projectid.trim()

  return {
    code: validCode,
    projectid: validProjectId,
  } 
}

module.exports = { normalize }
