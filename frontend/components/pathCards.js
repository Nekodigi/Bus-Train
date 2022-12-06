import { useEffect, useRef, useState } from "react";
import firebaseConfig from "../secrets/firebaseConfig.json";
import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore, onSnapshot, query, setDoc } 
from "firebase/firestore";
import PathCard from "./pathCard";
import { toDate } from "../utils/date";
import { Box } from "@mui/material";

export default function PathCards(){
  const [paths, setPaths] = useState([]);
  const calledOnce = useRef(false);

  const app = initializeApp(firebaseConfig);
  const db  = getFirestore(app); //no need for app if auth is not required

  const formatDates = (path) => {
    if(path.type === "bus"){
      path.from.date = toDate(path.from.date);
      path.mid.date = toDate(path.mid.date);
    }
    path.to.date = toDate(path.to.date);
    path.lastUpdate = toDate(path.lastUpdate);
    return path;
  }

  useEffect(() => {
    if(calledOnce.current)return;
    calledOnce.current = true;
    console.log(process.env.NEXT_PUBLIC_API_URL+"/api/update/all");
    fetch(process.env.NEXT_PUBLIC_API_URL+"/api/update/all");
    const q = query(collection(db, "paths"));
    const change = onSnapshot(q, (snapshot) => {
      setPaths([]);

      let paths_ = localStorage.getItem("paths");
      if(paths_ === null)paths_ = {};
      else paths_ = JSON.parse(paths_);
      paths_ = Object.keys(paths_).map(key => formatDates(paths_[key]));//format and convert to array
      paths_.forEach(path => path.kept = true);
      
      paths_.forEach(path => setPaths((prevPaths) => [...prevPaths, path ]));

      snapshot.forEach((doc) => {
        let path = doc.data();
        path = formatDates(path);

        let samePath = paths_.filter(path_ => path_.hash === path.hash);//length = 0 or 1
        if(samePath.length === 1)Object.assign(samePath, path);
        else paths_.push(path);
        
      });
      console.log(paths_);
      setPaths(paths_);
      //setPaths((prevPaths) => [...prevPaths, path ]);
    });
    return;
  }, [db])


  return (
    <div>
      <Box display={"flex"} flexDirection="column" gap={1}>
        {paths.map((path, i) => 
          <PathCard key={i} path={path}></PathCard>
        )}
      </Box>
    </div>
  )
}