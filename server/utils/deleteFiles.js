
const  { unlinkSync }= require('node:fs');


const deleteFile=async (fileName)=>{
    try {
        let path =`./uploads/${fileName}`;

        await unlinkSync(path);
        console.log(`successfully deleted ${fileName}`);
      } catch (err) {
        // handle the error
        console.log(err,"error is here in delete s")
      }
}

const deleteFilea=async (fileName)=>{
    try {
        let path =`./uploads/${fileName}`;

        await unlinkSync(path);
        console.log('successfully deleted /tmp/hello');
      } catch (err) {
        // handle the error
        console.log(err,"error is here in delete s")
      }
}
// deleteFilea("1655713087495ava.jpg")

module.exports = {
    deleteFile,
}