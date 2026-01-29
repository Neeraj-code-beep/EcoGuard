import bcrypt from "bcrypt";

const run = async () => {
  const password = "password123"; 
  // 👆 yaha EXACT wahi password likho
  // jo DB me pehle se hai

  const hash = await bcrypt.hash(password, 10);
  console.log("BCRYPT HASH 👇");
  console.log(hash);
};

run();
