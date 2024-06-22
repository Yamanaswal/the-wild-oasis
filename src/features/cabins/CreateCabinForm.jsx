import styled from "styled-components";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";
import FormRow from "../../ui/FormRow";

const Label = styled.label`
  font-weight: 500;
`;

function CreateCabinForm() {

  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, getValues, formState } = useForm();
  const { errors } = formState;

  const {
    mutate,
    isLoading: isCreating } = useMutation(
      {
        mutationFn: (newCabin) => {
          createEditCabin(newCabin)
        },
        onSuccess: (newCabin) => {
          toast.success("New Cabin created successfully.");

          queryClient.invalidateQueries({
            queryKey: ["cabins"]
          });

          reset();
        },
        onError: (error) => {
          toast.error(error.message);
        }
      });

  function onSubmit(data) {
    console.log(data);
    mutate({ ...data, image: data.image[0] });
  }

  function onError(err) {
    console.log("Error:", err);
  }

  const requiredField = "This field is required";

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>

      <FormRow label={"Cabin name"} errorMsg={errors?.name?.message} >
        <Input type="text" id="name" disabled={isCreating} {...register("name", {
          required: requiredField
        })} />
      </FormRow>

      <FormRow label={"Maximum capacity"} errorMsg={errors?.maxCapacity?.message}>
        <Input type="number" id="maxCapacity" disabled={isCreating} {...register("maxCapacity", {
          required: requiredField
        })} />
      </FormRow>

      <FormRow label={"Regular price"} errorMsg={errors?.regularPrice?.message}>
        <Input type="number" id="regularPrice" disabled={isCreating} {...register("regularPrice", {
          required: requiredField
        })} />
      </FormRow>

      <FormRow label={"Discount"} errorMsg={errors?.discount?.message}>
        <Input type="number" id="discount" disabled={isCreating} defaultValue={0} {...register("discount", {
          required: requiredField,
          validate: (value) => value <= getValues().regularPrice || "Discount should be less than regular price."
        })} />
      </FormRow>

      <FormRow label={"Description for website"} errorMsg={errors?.description?.message}>
        <Textarea type="number" id="description" disabled={isCreating} defaultValue="" {...register("description", {
          required: requiredField
        })} />
      </FormRow>

      <FormRow
        label={"Cabin photo"}>
        <FileInput
          id="image"
          accept="image/*"
          type="file"
          {...register("image")} />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset">
          Cancel
        </Button>

        <Button disabled={isCreating}>Add cabin</Button>

      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
