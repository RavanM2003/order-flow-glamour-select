import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFeatureData } from "../hooks/useFeatureData";
import { useFeatureActions } from "../hooks/useFeatureActions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Pencil, Trash } from "lucide-react";
import { Feature } from "../types";

const FeatureCardHeader = ({
  feature,
  onEdit,
  onDelete,
}: {
  feature: Feature;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <CardHeader>
    <div className="flex justify-between items-start">
      <div>
        <CardTitle>{feature.name}</CardTitle>
        <CardDescription>Feature ID: {feature.id}</CardDescription>
      </div>
      <div className="flex space-x-2">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-destructive"
        >
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>
  </CardHeader>
);

const FeatureCardContent = ({ feature }: { feature: Feature }) => (
  <CardContent>
    <div className="space-y-4">
      <div>
        <h3 className="font-medium">Description</h3>
        <p className="text-muted-foreground">
          {feature.description || "No description available"}
        </p>
      </div>
      <Separator />
      <div>
        <h3 className="font-medium">Details</h3>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p>{feature.isActive ? "Active" : "Inactive"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Category</p>
            <p>{feature.category || "Uncategorized"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Created At</p>
            <p>
              {feature.created_at
                ? new Date(feature.created_at).toLocaleDateString()
                : "Unknown"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Updated At</p>
            <p>
              {feature.updated_at
                ? new Date(feature.updated_at).toLocaleDateString()
                : "Unknown"}
            </p>
          </div>
        </div>
      </div>
    </div>
  </CardContent>
);

const FeatureCard = ({
  feature,
  onEdit,
  onDelete,
  onBack,
}: {
  feature: Feature;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
}) => (
  <Card>
    <FeatureCardHeader feature={feature} onEdit={onEdit} onDelete={onDelete} />
    <FeatureCardContent feature={feature} />
    <CardFooter>
      <Button variant="outline" onClick={onBack}>
        Back to Features
      </Button>
    </CardFooter>
  </Card>
);

const DeleteFeatureDialog = ({
  isOpen,
  onOpenChange,
  onDelete,
  isDeleting,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  isDeleting: boolean;
}) => (
  <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Are you sure you want to delete this feature?
        </AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the feature
          and remove the data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button variant="destructive" onClick={onDelete} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

const FeatureDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { feature, isLoading, fetchFeature } = useFeatureData();
  const { deleteFeature } = useFeatureActions(() => {
    navigate("/features");
  });

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchFeature(id);
    }
  }, [id, fetchFeature]);

  const handleEdit = () => {
    navigate(`/features/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!id) return;

    setIsDeleting(true);
    try {
      const result = await deleteFeature(id);
      if (result) {
        // Success handled by callback
      }
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <p>Loading feature details...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!feature) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <p>
              Feature not found or an error occurred while loading the data.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <FeatureCard
        feature={feature}
        onEdit={handleEdit}
        onDelete={() => setIsDeleteDialogOpen(true)}
        onBack={() => navigate("/features")}
      />

      <DeleteFeatureDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default FeatureDetail;
