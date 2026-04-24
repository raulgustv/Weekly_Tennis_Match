import { Avatar, message, Tooltip, Upload } from "antd";
import { CameraOutlined } from "@ant-design/icons";
import { useState } from "react"
import { uploadPicture } from "../../actions/auth";
import { toast } from "react-toastify";


const ProfilePicture = ({ user, profilePicture, size = 125, editable }) => {

    //console.log(user)

    const [loading, setLoading] = useState(false);
    const [hovered, setHovered] = useState(false)
    const [imageUrl, setImageUrl] = useState(profilePicture || null);

    const beforeUpload = (file) => {
        const isValidType = ["image/jpeg", "image/png", "image/webp"].includes(file.type);

        if (!isValidType) {
            message.error("Only JPG, PNG or WEBP files allowed");
            return Upload.LIST_IGNORE;
        }

        const isValidSize = file.size / 1024 / 1024 < 10;
        if (!isValidSize) {
            message.error("Max size allowed is 2MB");
            return Upload.LIST_IGNORE;
        }

    }

    const handleUpload = async ({ file, onSuccess, onError }) => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("image", file);

            const res = await uploadPicture(formData);
            setImageUrl(res?.profilePicture?.url)
            toast.success(res?.message)
            onSuccess("ok")
        } catch (error) {
            console.log(error)
            toast.error("Upload failed")
            onError(error)
        } finally {
            setLoading(false)
        }
    }
    const initials = `${user?.name?.[0] || ""}${user?.lastname?.[0] || ""}`

    return (
        <>
            <Upload
                name="image"
                showUploadList={false}
                beforeUpload={beforeUpload}
                accept="image/jpeg,image/png,image/webp"
                customRequest={handleUpload}
                disabled={!editable}
            >
                <Tooltip title={editable ? "Change profile picture" : ""} placement="bottom">
                    <div
                        style={{
                            position: "relative",
                            width: size,
                            height: size,
                            margin: "0 auto",
                            cursor: editable ? "pointer" : "default"
                        }}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    >
                        <Avatar
                            size={size}
                            src={imageUrl || undefined}
                            //icon={!imageUrl && <UserOutlined />}
                            style={{
                                backgroundColor: !imageUrl ? "#1F8F4E" : undefined,
                                fontSize: size / 2.5,
                                fontWeight: "bold",
                                transition: "0.3s",
                                opacity: hovered && editable ? 0.7 : 1,
                            }}
                        >
                            {!imageUrl && initials}
                        </Avatar>

                        {hovered && editable && (
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    borderRadius: "50%",
                                    background: "rgba(0,0,0,0.35)",
                                    backdropFilter: "blur(2px)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "all 0.3s ease",
                                }}
                            >
                                <div
                                    style={{
                                        width: size * 0.32,
                                        height: size * 0.32,
                                        borderRadius: "50%",
                                        background: "rgba(255,255,255,0.15)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "white",
                                        fontSize: size * 0.18,
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    <CameraOutlined spin={loading} />
                                </div>
                            </div>
                        )}


                    </div>
                </Tooltip>
            </Upload>
        </>
    )
}

export default ProfilePicture