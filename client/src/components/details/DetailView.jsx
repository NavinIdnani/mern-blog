import {useEffect, useState, useContext} from 'react';
import {Box, Typography, styled} from '@mui/material';
import {Edit, Delete} from '@mui/icons-material';
import {useParams, Link, useNavigate} from 'react-router-dom';
import {API} from '../../service/api';
import {DataContext} from '../../context/DataProvider';
import Comments from './comments/Comments';

// ... (keep all your styled components as they are)

const Container=styled(Box)(({theme})=>({
    margin:'50px 100px',
    [theme.breakpoints.down('md')]: {
        margin:0
    }
}));
const Image=styled('img')({
    width:'100%',
    height:'50vh',
    objectFit:'cover'
});

const Heading=styled(Typography)`
    font-size:30px;   
    font-weight:600;
    text-align:center;
    margin:50px 0 10px 0;
    word-break:break-word;
`
const EditIcon=styled(Edit)`
    margin:5px;
    padding:5px;
    border:1px solid #878787;
    border-radius:10px;
`
const DeleteIcon=styled(Delete)`
    margin:5px;
    padding:5px;
    border:1px solid #878787;
    border-radius:10px;
`;

const Author=styled(Box)`
    color:#878787;
    margin:20px 0;
    display:flex;
`;

const Description=styled(Typography)`
    word-break:break-word;
`

const DetailView = () => {
    const [post, setPost] = useState({
        username: '', // Initialize with empty values
        title: '',
        description: '',
        picture: '',
        createdDate: new Date()
    });
    
    const {id} = useParams();
    const {account} = useContext(DataContext);
    const navigate = useNavigate();

    const defaultImage = 'https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwc2V0dXB8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80';

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await API.getPostById(id);
                if (response.isSuccess) {
                    setPost({
                        ...response.data,
                        // Ensure createdDate is properly initialized
                        createdDate: response.data.createdDate || new Date()
                    });
                }
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };
        fetchPost();
    }, [id]); // Add id to dependency array

    return (
        <Container>
            <Image src={post.picture || defaultImage} alt="blog" />

            {/* Edit/Delete buttons - only render when post data is complete */}
            {post._id && account.username === post.username && (
                <Box style={{float: 'right'}}>
                    <Link to={`/update/${post._id}`}>
                        <EditIcon color="primary" />
                    </Link>
                    <DeleteIcon onClick={deleteBlog} color="error" />
                </Box>
            )}

            <Heading>{post.title}</Heading>

            {/* Author section - only render when username exists */}
            {post.username && (
                <Author>
                    <Link to={`/?username=${post.username}`} style={{textDecoration: 'none', color: 'inherit'}}>
                        <Typography>
                            Author: <Box component="span" style={{fontWeight: 600}}>{post.username}</Box>
                        </Typography>
                    </Link>
                    {post.createdDate && (
                        <Typography style={{marginLeft: 'auto'}}>
                            {new Date(post.createdDate).toDateString()}
                        </Typography>
                    )}
                </Author>
            )}

            <Description>{post.description}</Description>
            {post._id && <Comments post={post} />}
        </Container>
    );
};

export default DetailView;




// import {useEffect,useState,useContext} from 'react';
// import{Box,Typography,styled} from '@mui/material';
// import {Edit,Delete} from '@mui/icons-material';

// import {useParams ,Link, useNavigate} from 'react-router-dom';
// import { API } from '../../service/api';
// import{DataContext} from '../../context/DataProvider';

// //Component
// import Comments from './comments/Comments';

// const Container=styled(Box)(({theme})=>({
//     margin:'50px 100px',
//     [theme.breakpoints.down('md')]: {
//         margin:0
//     }
// }));
// const Image=styled('img')({
//     width:'100%',
//     height:'50vh',
//     objectFit:'cover'
// });

// const Heading=styled(Typography)`
//     font-size:30px;   
//     font-weight:600;
//     text-align:center;
//     margin:50px 0 10px 0;
//     word-break:break-word;
// `
// const EditIcon=styled(Edit)`
//     margin:5px;
//     padding:5px;
//     border:1px solid #878787;
//     border-radius:10px;
// `
// const DeleteIcon=styled(Delete)`
//     margin:5px;
//     padding:5px;
//     border:1px solid #878787;
//     border-radius:10px;
// `;

// const Author=styled(Box)`
//     color:#878787;
//     margin:20px 0;
//     display:flex;
// `;

// const Description=styled(Typography)`
//     word-break:break-word;
// `

// const DetailView=()=>{
//     const[post,setPost]=useState({});

//     const { id }=useParams();

//     console.log("Fetched id from URL:", id);
    
//     const{account}=useContext(DataContext);

//     const navigate=useNavigate();
    
//     const url=post.picture ? post.picture: 'https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwc2V0dXB8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80';

//     useEffect(()=>{
//         const fetchData=async()=>{
//             let response= await API.getPostById(id);
//             if(response.isSuccess){
//                 setPost(response.data);
//             }
//         }
//         fetchData();
//     },[])

//     console.log("Logged in user:", account.username);
//     console.log("Post author:", post.username);

//     const deleteBlog=async()=>{
//         let response=await API.deletePost(post._id);
//         if(response.isSuccess){
//             navigate('/');
//         }
//     }
//     return(
//         <Container>
//             <Image src={post.picture || url} alt="blog"/>

//             <Box style={{float:'right'}}>
//             {
//                 account.username === post.username &&
//                 <>
//                   <Link to={`/update/${post._id}`} > <EditIcon color='primary' /> </Link>
//                     <DeleteIcon onClick={()=>deleteBlog()} color='error'/>
//                 </>
//             }
//             </Box>
//             <Heading>{post.title}</Heading>

//             <Author>
//             <Link to={`/?username=${post.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
//                 <Typography>Author: <Box component="span" style={{fontWeight:600}}>{post.username}</Box></Typography>
//             </Link>
//                 <Typography style={{marginLeft:'auto'}}>{new Date(post.createdDate).toDateString()}</Typography>
//             </Author>

//             <Description>{post.description}</Description>
//             <Comments post={post}/>
//         </Container>
//     )

// }
// export default DetailView;
