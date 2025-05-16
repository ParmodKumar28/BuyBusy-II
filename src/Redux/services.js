let base_url;
if(process.env.REACT_APP_APP_ENV === 'development'){
    base_url = process.env.REACT_APP_API_URL_LOCAL;
}else{
    base_url = "https://busybuy-backend.onrender.com";
}

export default base_url;