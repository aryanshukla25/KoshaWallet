import React from "react";
import { useForm } from "@mantine/form";
import {
  Anchor,
  Button,
  Card,
  Divider,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { collection, getDocs, query, where } from "firebase/firestore";
import { fireDb } from "../firebaseConfig";
import cryptojs from "crypto-js";
import { showNotification } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginForm = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
       dispatch(ShowLoading())
      const qry = query(
        collection(fireDb, "users"),
        where("email", "==", loginForm.values.email)
      );
      const existingUsers = await getDocs(qry);
      if (existingUsers.size > 0) {
        // decrypt password
        const decryptedPassword = cryptojs.AES.decrypt(
          existingUsers.docs[0].data().password,
          "sheymoney-lite"
        ).toString(cryptojs.enc.Utf8);
        if (decryptedPassword === loginForm.values.password) {
          showNotification({
            title: "Login successful",
            color: "green",
          });
          const dataToPutInLocalStorage = {
            name: existingUsers.docs[0].data().name,
            email: existingUsers.docs[0].data().email,
            id: existingUsers.docs[0].id,
          };
          localStorage.setItem("user", JSON.stringify(dataToPutInLocalStorage));
          navigate("/");
        } else {
          showNotification({
            title: "Invalid credentials",
            color: "red",
          });
        }
      } else {
        showNotification({
          title: "User does not exist",
          color: "red",
        });
      }
      dispatch(HideLoading())
    } catch (error) {
      dispatch(HideLoading())
      showNotification({
        title: "Something went wrong",
        color: "red",
      });
    }
  };

  return (
    <div className="flex h-screen justify-center items-center auth">
      <Card
        sx={{
          width: 400,
          padding: "sm",
        }}
        shadow="lg"
        withBorder
      >
        <Title order={2} mb={5}
         color="gray"
        >
           KoshaWallet - LOGIN 
        </Title>
        <Divider variant="dotted" color="gray" />
        <form action="" onSubmit={onSubmit}>
          <Stack mt={5}>
            <TextInput
              label="Email"
              placeholder="Enter your email"
              name="email"
              {...loginForm.getInputProps("email")}
            />
            <TextInput
              label="Password"
              placeholder="Enter your password"
              type="password"
              name="password"
              {...loginForm.getInputProps("password")}
            />
            <Button type="submit" color="violet">
              Login
            </Button>
            <Anchor href="/register" 
             color='violet'
            >Don't have an account? Register</Anchor>
          </Stack>
        </form>
      </Card>
    </div>
  );
}

export default Login;
