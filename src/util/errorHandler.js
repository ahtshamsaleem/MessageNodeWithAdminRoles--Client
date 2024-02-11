export const errorMsgHandler = (error, customMessage) => {
    let errorMessage;
    if(!error.response) {
        errorMessage = error.message;
        return errorMessage;
    } 

    if(customMessage) {
        errorMessage = customMessage;
        return errorMessage;
    } 

    errorMessage = error.response.data.message;





    return errorMessage
}