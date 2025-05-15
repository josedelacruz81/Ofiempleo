"use client";
import { parroquias } from "@/types";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
} from "@nextui-org/react";
import { useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { PasswordModal } from "./PasswordModal";
import { useToast } from "../shadCn/useToast";
import { processZodError, userDataSchema } from "@/lib/zodValidations";

interface userDataInterface {
  location?: string;
  description?: string;
}

export const EditUser = ({ user, session }: { user: any; session: any }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState(user.description);
  const parroquiaDefault = parroquias.find((p) => p.value === user.location);
 
  const [errors, setErrors] = useState<userDataInterface>({});
  const { toast } = useToast();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setErrors({});
     
      const validData = userDataSchema.parse({ description, location });
     
      const res = await fetch(`/api/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: validData.location,
          description: validData.description,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({
          title: "Cambios guardados",
          description: data.message,
          variant: "destructive",
          className: "text-warning bg-warning-100",
        });
      }
      toast({
        title: "Cambios guardados",
        description: data.message,
        variant: "destructive",
        className: "text-green-500 bg-green-100",
      });
      setIsEditing(false);
    } catch (error) {
      const errors = processZodError(error);
      setErrors(errors);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3 w-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col grow border-2 border-[#e4eef6] rounded-xl px-2 py-2"
      >
        <h4 className=" font-medium text-gray-600 mb-2">Información</h4>
        <div className="grid md:grid-cols-2 gap-4">
          {/* <Input label="Email" variant="bordered" disabled value={user.email} /> */}
          {session?.user?.id.toString() === user.id.toString() && (
            <>
              <Input
                label="Correo electrónico"
                disabled
                defaultValue={user.email}
              />
              <Input
                label="Número de teléfono"
                disabled
                defaultValue={user.phone}
              />
            </>
          )}

          <fieldset>
            {isEditing ? (
              <>
                <Autocomplete
                  selectedKey={location}
                  defaultItems={parroquias}
                  placeholder={parroquiaDefault?.label}
                  variant="faded"
                  //@ts-ignore
                  onSelectionChange={(e) => setLocation(e)}
                  label="Parroquia"
                  aria-label="Parroquia"
                >
                  {({ value, label }) => (
                    <AutocompleteItem key={value} value={value}>
                      {label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
                {errors.location && (
                  <p className="text-red-500 text-xs">{errors.location}</p>
                )}
              </>
            ) : (
              <Input
                label="Lugar"
                variant="flat"
                disabled
                defaultValue={parroquiaDefault?.label}
              />
            )}
          </fieldset>

          <fieldset>
            <Input
              onChange={(e) => setDescription(e.target.value)}
              variant={isEditing ? "faded" : "flat"}
              label={<p>Descripción (opcional)</p>}
              placeholder={!description ? "Agrega una descripción" : ""}
              disabled={!isEditing}
              defaultValue={description}
            />
            {isEditing && errors.description && (
              <p className="text-red-500 text-xs">{errors.description}</p>
            )}
          </fieldset>
        </div>
        {session?.user?.id.toString() === user.id.toString() && (
          <>
            {isEditing ? (
              <div className="grid md:grid-cols-2 my-4  gap-2">
                <Button
                  fullWidth
                  onPress={() => setIsEditing(!isEditing)}
                  color="danger"
                  variant="light"
                >
                  Cancelar
                </Button>
                <Button
                  isLoading={isLoading}
                  type="submit"
                  fullWidth
                  color="primary"
                  variant="flat"
                >
                  Guardar cambios
                </Button>
              </div>
            ) : (
              <Button
                onPress={() => setIsEditing(!isEditing)}
                className="my-4"
                color="primary"
                variant="light"
                endContent={<FiEdit3 />}
              >
                Editar
              </Button>
            )}
          </>
        )}
      </form>
      {session?.user?.id.toString() === user.id.toString() && (
        <PasswordModal userId={session?.user?.id.toString()} />
      )}
    </div>
  );
};
