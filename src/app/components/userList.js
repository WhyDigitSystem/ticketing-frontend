import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";

// Example user list
const userList = [
    { id: "1", name: "John Doe", avatar: "/assets/images/face-1.jpg" },
    { id: "2", name: "Jane Smith", avatar: "/assets/images/face-2.jpg" },
    { id: "3", name: "Frank Powell", avatar: "/assets/images/faces/13.jpg" }
];

export default function UserListNew({ onUserSelect }) {
    return (
        <div style={{ width: "600px", borderRight: "1px solid #ddd", backgroundColor: 'white' }}>
            <div style={{ margin: 'auto' }}><h5>Chat section</h5></div>
            <List>
                {userList.map((user) => (
                    <ListItem button key={user.id} onClick={() => onUserSelect(user)}>
                        <ListItemAvatar>
                            <Avatar src={user.avatar} />
                        </ListItemAvatar>
                        <ListItemText primary={user.name} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
}
