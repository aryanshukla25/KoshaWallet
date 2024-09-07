import React, { useEffect } from "react";
import { useForm } from "@mantine/form";
import { Select, Stack, TextInput, Button, Group } from "@mantine/core";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { fireDb } from "../firebaseConfig";
import { showNotification } from "@mantine/notifications";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import moment from "moment";

function TransactionForm({
  formMode,
  setFormMode,
  setShowForm,
  transactionData,
  getData,
}) {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  const trasactionForm = useForm({
    initialValues: {
      name: "",
      type: "",
      amount: "",
      date: "",
      category: "",
      reference: "",
    },
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      dispatch(ShowLoading());
      if(formMode === "add") 
      {
        await addDoc(
          collection(fireDb, `users/${user.id}/transactions`),
          trasactionForm.values
        );
      }else{
        await setDoc(
          doc(fireDb, `users/${user.id}/transactions`, transactionData.id),
          trasactionForm.values
        );
      }
    
      showNotification({
        title: formMode === "add" ? "Transaction added" : "Transaction updated",
        color: "green",
      });
      dispatch(HideLoading());
      getData()
      setShowForm(false);
    } catch (error) {
      showNotification({
        title: formMode === "add" ? "Error adding transaction" : "Error updating transaction",
        color: "red",
      });
      dispatch(HideLoading());
    }
  };

  useEffect(() => {
    if (formMode === "edit") {
      trasactionForm.setValues(transactionData);
      trasactionForm.setFieldValue(
        "date",
        moment(transactionData.date, "YYYY-MM-DD").format("YYYY-MM-DD")
      );
    }
  }, [transactionData]);

  return (
    <div>
      <form action="" onSubmit={onSubmit}>
        <Stack>
          <TextInput
            name="name"
            label="Name"
            placeholder="Enter Transaction Name"
            {...trasactionForm.getInputProps("name")}
          />
          <Group position="apart" grow>
            <Select
              name="type"
              label="Type"
              placeholder="Select Transaction Type"
              data={[
                { label: "Income", value: "income" },
                { label: "Expense", value: "expense" },
              ]}
              {...trasactionForm.getInputProps("type")}
            />

            <Select
              name="category"
              label="Category"
              placeholder="Select Transaction Category"
              data={[
                { label: "Food", value: "food" },
                { label: "Transport", value: "transport" },
                { label: "Shopping", value: "shopping" },
                { label: "Entertainment", value: "entertainment" },
                { label: "Health", value: "health" },
                { label: "Education", value: "education" },
                { label: "Salary", value: "salary" },
                { label: "Freelance", value: "freelance" },
                { label: "Business", value: "Business" },
              ]}
              {...trasactionForm.getInputProps("category")}
            />
          </Group>
          <Group grow>
            <TextInput
              name="amount"
              label="Amount"
              placeholder="Enter Transaction Amount"
              {...trasactionForm.getInputProps("amount")}
            />

            <TextInput
              name="date"
              label="Date"
              type="date"
              placeholder="Enter Transaction Date"
              {...trasactionForm.getInputProps("date")}
            />
          </Group>

          <TextInput
            name="reference"
            label="Reference"
            placeholder="Enter Transaction Reference"
            {...trasactionForm.getInputProps("reference")}
          />

          <Button color="cyan" type="submit">
            {formMode === "add" ? "Add Transaction" : "Update Transaction"}
          </Button>
        </Stack>
      </form>
    </div>
  );
}

export default TransactionForm;
