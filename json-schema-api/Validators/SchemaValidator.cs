using Newtonsoft.Json.Schema;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

public static class SchemaValidator
{
    private static CustomValidationError MapValidationError(ValidationError error)
    {
        var customError = new CustomValidationError
        {
            ErrorType = error.ErrorType.ToString(),
            Property = error.Path,
            ErrorMessage = error.Message
        };

        foreach (var childError in error.ChildErrors)
        {
            customError.Errors.Add(MapValidationError(childError));
        }

        return customError;
    }

    public static List<CustomValidationError> ToCustomValidationErrors(IList<ValidationError> errors)
    {
        var customErrors = new List<CustomValidationError>();

        foreach (var error in errors)
        {
            customErrors.Add(MapValidationError(error));
        }

        return customErrors;
    }
}
