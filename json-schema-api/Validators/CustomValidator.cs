using System.Text;
using Newtonsoft.Json.Linq;

public class CustomValidator
{
    public static List<CustomValidationError> Validate(
        JObject data,
        JObject configurations)
    {
        var errors = new List<CustomValidationError>();

        foreach (var property in configurations.Properties())
        {
            string[] keys = property.Name.Split("__");

            var propertyPath = string.Join(".", keys);

            JToken value = GetPropertyValue(data, keys);

            if (value == null)
            {
                errors.Add(new CustomValidationError
                {
                    ErrorType = "CustomValidationError",
                    Property = propertyPath,
                    ErrorMessage = "Property not found."
                });
                continue;
            }

            var validationConfig = property.Value.ToObject<Dictionary<string, object>>();

            ValidateProperty(
                propertyPath,
                value,
                validationConfig,
                errors);
        }

        return errors;
    }

    private static JToken GetPropertyValue(JObject data, string[] keys)
    {
        JToken token = data;
        foreach (var key in keys)
        {
            if (token[key] == null)
                return null;

            token = token[key];
        }
        return token;
    }

    private static void ValidateProperty(
        string propertyPath,
        JToken value,
        Dictionary<string, object> validationConfig,
        List<CustomValidationError> errors)
    {
        var autoPopulateConfig = (bool)validationConfig["autoPopulate"];

        if (autoPopulateConfig)
        {
            var val = value.ToString();
            if (string.IsNullOrEmpty(val))
            {
                errors.Add(new CustomValidationError
                {
                    ErrorType = "CustomValidationError",
                    Property = propertyPath,
                    ErrorMessage = $"{propertyPath} is required."
                });
            }
            else if (val != "EcoHub")
            {
                errors.Add(new CustomValidationError
                {
                    ErrorType = "CustomValidationError",
                    Property = propertyPath,
                    ErrorMessage = $"{propertyPath} must be EcoHub not {val}."
                });
            }
        }
    }
}