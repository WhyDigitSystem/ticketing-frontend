import { Attachment, Clear, TagFaces } from "@mui/icons-material";
import { Avatar, Box, Divider, IconButton, TextField, styled } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import ScrollBar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css"; // Import styles for react-perfect-scrollbar
import { H5, H6, Span } from "./Typography";

// Define globalMessageList to store the messages
let globalMessageList = [];

// STYLED COMPONENTS
const ChatContainer = styled("div")({
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: "#f0f0f0",
    padding: "10px",
    width: "400px", // Set static width
});

const convertHexToRGB = (hex) => {
    hex = hex.replace("#", "");
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    return `${r},${g},${b}`;
};

const StyledScrollBar = styled(ScrollBar)({
    flexGrow: 1,
    padding: "10px",
    overflowX: "hidden", // Ensure horizontal overflow is hidden
});

const ProfileBox = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "5px 5px 5px 10px",
    color: "#000",
    background: "#fafafa",
    borderBottom: "1px solid #ddd"
}));

const ChatStatus = styled("div")(() => ({
    marginLeft: "12px",
    "& h5": {
        marginTop: 0,
        fontSize: "14px",
        marginBottom: "3px",
        color: "#000"
    },
    "& span": { fontWeight: "500", color: "#000" }
}));

const ChatMessage = styled("div")(({ theme, isOwn }) => ({
    padding: "10px",
    maxWidth: "100%",
    fontSize: "14px",
    borderRadius: "20px",
    marginBottom: "8px",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    color: "#fff",
    background: isOwn ? "#0084ff" : "#e5e5ea",
    alignSelf: isOwn ? "flex-end" : "flex-start",
    borderBottomRightRadius: isOwn ? "0px" : "20px",
    borderBottomLeftRadius: isOwn ? "20px" : "0px",
    color: isOwn ? "#fff" : "#000",
    position: "relative",
    paddingBottom: "20px"
}));

const MessageTime = styled("span")({
    fontSize: "10px",
    fontWeight: "500",
    position: "absolute",
    bottom: "5px",
    right: "10px",
    color: "#ccc"
});

const ChatImgContainer = styled("div")({
    display: "flex",
    justifyContent: "flex-end"
});

const ChatImgBox = styled("div")(() => ({
    padding: "8px",
    fontSize: "14px",
    maxWidth: 240,
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    background: "#e5e5ea",
    color: "#000"
}));

const ChatImg = styled("img")(() => ({ width: "40px" }));

export default function ChatboxMain({ user, togglePopup }) {
    const [isAlive, setIsAlive] = useState(true);
    const [message, setMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const currentUserId = "7863a6802ez0e277a0f98534";
    const chatScrollRef = useRef(null);

    const sendMessageOnEnter = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            let tempMessage = message.trim();
            if (tempMessage !== "") {
                let tempList = [...messageList];
                let messageObject = {
                    text: tempMessage,
                    contactId: currentUserId,
                    time: new Date().toISOString()
                };
                tempList.push(messageObject);
                globalMessageList.push(messageObject);
                if (isAlive) setMessageList(tempList);
                dummyReply();
            }
            setMessage("");
        }
    };

    const dummyReply = async () => {
        setTimeout(() => {
            let tempList = [...messageList];
            let messageObject = {
                text: "Good to hear from you. Enjoy!!!",
                contactId: "opponents-contact-id",
                avatar: "/assets/images/faces/13.jpg",
                name: "Frank Powell",
                time: new Date().toISOString()
            };

            tempList.push(messageObject);
            globalMessageList.push(messageObject);
            if (isAlive) setMessageList(globalMessageList);
        }, 2000);
    };

    const scrollToBottom = useCallback(() => {
        if (chatScrollRef.current) {
            chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
    }, []);

    useEffect(() => {
        if (isAlive) {
            setMessageList([
                {
                    contactId: "323sa680b3249760ea21rt47",
                    text: "Hello!",
                    time: "2018-02-10T08:45:28.291Z",
                    id: "323sa680b3249760ea21rt47",
                    name: "Frank Powell",
                    avatar: "/assets/images/faces/13.jpg",
                    status: "online",
                    mood: ""
                },
                {
                    contactId: "7863a6802ez0e277a0f98534",
                    text: "Check my issue",
                    time: "2018-02-10T08:45:28.291Z",
                    id: "7863a6802ez0e277a0f98534",
                    name: "John Doe",
                    avatar: "/assets/images/face-1.jpg",
                    status: "online",
                    mood: ""
                }
            ]);
        }
    }, [isAlive]);

    useEffect(() => {
        scrollToBottom();
    }, [messageList, scrollToBottom]);

    return (
        <ChatContainer>
            <ProfileBox>
                <Box display="flex" alignItems="center">
                    <Avatar src={user.avatar} />
                    <ChatStatus>
                        <H5>{user.name}</H5>
                        <Span>Active</Span>
                    </ChatStatus>
                </Box>
                <IconButton onClick={togglePopup}>
                    <Clear fontSize="small" />
                </IconButton>
            </ProfileBox>
            <StyledScrollBar ref={chatScrollRef}>
                {messageList.map((item, ind) => (
                    <Box
                        key={ind}
                        p="20px"
                        display="flex"
                        sx={{ justifyContent: currentUserId === item.contactId ? "flex-end" : "flex-start" }}
                    >
                        {currentUserId !== item.contactId && <Avatar src={item.avatar} />}
                        <Box ml="12px">
                            {currentUserId !== item.contactId && (
                                <H5 mb={0.5} fontSize={14} color="#000">
                                    {item.name}
                                </H5>
                            )}
                            <ChatMessage isOwn={currentUserId === item.contactId}>{item.text}</ChatMessage>
                            <MessageTime>
                                {new Date(item.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </MessageTime>
                        </Box>
                    </Box>
                ))}

                {/* Example of image sent by current user */}
                <ChatImgContainer>
                    <Box ml="12px">
                        <ChatImgBox>
                            <ChatImg alt="laptop" src="/assets/images/laptop-1.png" />
                            <Box ml="12px">
                                <H6 mt={0} mb={0.5} color="#000">
                                    Asus K555LA.png
                                </H6>
                                <MessageTime>21.5KB</MessageTime>
                            </Box>
                        </ChatImgBox>
                    </Box>
                </ChatImgContainer>
            </StyledScrollBar>

            <Divider sx={{ background: `rgba(${convertHexToRGB("#000")}, 0.15)` }} />

            {/* Ensure TextField component is rendered */}
            <TextField
                multiline
                fullWidth
                rowsMax={4}
                value={message}
                placeholder="Type a message ..."
                onKeyUp={sendMessageOnEnter}
                onChange={(e) => setMessage(e.target.value)}
                sx={{ "& textarea": { color: "#000" } }}
                InputProps={{
                    endAdornment: (
                        <Box display="flex">
                            <IconButton size="small">
                                <TagFaces />
                            </IconButton>
                            <IconButton size="small">
                                <Attachment />
                            </IconButton>
                        </Box>
                    ),
                    classes: { root: "pl-5 pr-3 py-3 text-body" }
                }}
            />
        </ChatContainer>
    );
}

