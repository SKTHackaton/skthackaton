import React, { useState } from 'react';
import { storage, db, ref, uploadBytes, getDownloadURL, collection, addDoc,serverTimestamp } from '../../firebase-config';
 // Firebase에서 가져온 설정 정보
 import { getAuth, onAuthStateChanged } from 'firebase/auth';
 import '../BoardWrite.css';

function BoardWrite() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [newPost, setNewPost] = useState({ title: '', content: '' });

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    if (!userUID) {
        alert("Please log in to create a post.");
        return;
      }

    // Firebase Storage에 파일 업로드
    const storageRef = ref(storage, `uploads/${selectedFile.name}`);
    const uploadTask = uploadBytes(storageRef, selectedFile);

    try {
      await uploadTask;

      // Firebase Storage에 업로드된 파일의 다운로드 URL 가져오기
      const downloadURL = await getDownloadURL(storageRef);

      // Firebase Firestore에 게시글 저장
      const postRef = collection(db, 'posts'); // Firestore 컬렉션
      const newPostData = {
        title: newPost.title,
        content: newPost.content,
        imageUrl: downloadURL, // 이미지 URL 저장
        authorUID: userUID, // 사용자 UID 저장
        createdTimestamp: serverTimestamp(), // 현재 시간 저장
      };
      await addDoc(postRef, newPostData);

      console.log('Uploaded file URL:', downloadURL);
      // 게시글이 성공적으로 생성된 경우 처리
    } catch (error) {
      console.error('Upload error:', error);
      // 업로드 중 오류 발생 시 처리
    }


  };
    const auth = getAuth();
    let userUID = null;

    onAuthStateChanged(auth, (user) => {
        if (user) {
          // 사용자가 로그인한 경우
          userUID = user.uid;
        } else {
          // 사용자가 로그아웃한 경우 또는 로그인하지 않은 경우
          userUID = null;
        }
      });


  

  return (
    <div className='App-back'>
      <div className="board-write-container">
        <h1>게시글 작성</h1>
        <form onSubmit={handleFormSubmit} encType="multipart/form-data">
          <input
            type="text"
            placeholder="제목"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <textarea
            placeholder="내용"
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            rows={6}
          />
          <input type="file" name="file" onChange={handleFileChange} />
          <div className="submit-button-container">
            <input type="submit" value="게시글 작성" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default BoardWrite;
