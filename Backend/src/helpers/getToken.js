const getToken = (request) => {
    const autorHeader = request.headers.authorization

    const token = autorHeader.split(" ")[1]

    return token
}

export default getToken