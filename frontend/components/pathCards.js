import { useEffect, useRef, useState } from "react";
import firebaseConfig from "../secrets/firebaseConfig.json";
import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore, onSnapshot, query, setDoc } 
from "firebase/firestore";
import PathCard from "./pathCard";
import { minDiff, toDate } from "../utils/date";
import { Box } from "@mui/material";

export default function PathCards(){
  const [paths, setPaths] = useState([]);
  const calledOnce = useRef(false);

  const app = initializeApp(firebaseConfig);
  const db  = getFirestore(app); //no need for app if auth is not required

  const formatDates = (path) => {
    path.to.date = toDate(path.to.date);
    path.lastUpdate = toDate(path.lastUpdate);
    if(path.type === "bus"){
      path.from.date = toDate(path.from.date);
      path.mid.date = toDate(path.mid.date);
      path.from.min = minDiff(path.from.date, new Date());//update
    }else{
      path.to.min = minDiff(path.to.date, new Date());//
    }
    return path;
  }

  const fetchUpdate = () => {
    console.log("fetch upate");
    console.log(process.env.NEXT_PUBLIC_API_URL+"/api/update/all");
    fetch(process.env.NEXT_PUBLIC_API_URL+"/api/update/all");
    const q = query(collection(db, "paths"));
    const change = onSnapshot(q, (snapshot) => {
      setPaths([]);

      //load saved (kept) path
      let paths_ = localStorage.getItem("paths");
      if(paths_ === null)paths_ = {};
      else paths_ = JSON.parse(paths_);
      paths_ = Object.keys(paths_).map(key => formatDates(paths_[key]));//format and convert to array
      paths_.forEach(path => path.kept = true);
      paths_.forEach(path => setPaths((prevPaths) => [...prevPaths, path ]));

      //load server path
      snapshot.forEach((doc) => {
        let path = doc.data();
        path = formatDates(path);

        console.log("START")
        console.log(path.to.date)
        let samePathId = paths_.findIndex(path_ => path_.hash === path.hash);//length = 0 or 1
        if(samePathId !== -1){path.kept=true; paths_[samePathId] = path;}//update with new data
        else if(path.valid)paths_.push(path);
        
      });
      console.log(paths_.map(path => path.hash));
      setPaths(paths_);
      //setPaths((prevPaths) => [...prevPaths, path ]);
    });
    return;
  }

  useEffect(() => {
    if(calledOnce.current)return;
    calledOnce.current = true;
    fetchUpdate();
    setInterval(fetchUpdate, 60*1000);
    return;
  }, [])

  

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