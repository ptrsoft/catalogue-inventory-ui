import React from "react";

const InventoryAdjustments = () => {
  const handleImageUpload1 = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const fileName = encodeURIComponent(file.name);
      try {
        const response = await fetch(
          `https://lou294nkli.execute-api.us-east-1.amazonaws.com/uploadUrl?fileName=${fileName}`
        );
        const { uploadUrl } = await response.json();
        // console.log("response", response.json());
        console.log("url", uploadUrl.split("?")[0]);
        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
        });

        if (uploadResponse.ok) {
          console.log("File uploaded successfully.");
        } else {
          console.error("Failed to upload the file.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div>
      <input type="file" id="upload-button-1" onChange={handleImageUpload1} />
    </div>
  );
};

export default InventoryAdjustments;
