function getCurrentDateTime() {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    const formattedTime = currentDate.toLocaleTimeString();
  
    return `[${formattedDate} ${formattedTime}]`;}
    module.exports = getCurrentDateTime