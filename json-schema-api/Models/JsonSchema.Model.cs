public class JsonSchemaModel
{
    public string Schema { get; set; }
    public string Configuration { get; set; }
}

public class ValidationRequest
{
    public string Data { get; set; }
}

public class Configuration
{
    public bool AutoPopulate { get; set; }
    public string AutoPopulateField { get; set; }
    public int Order { get; set; }
}

public class CustomValidationError
{
    public string ErrorType { get; set; }
    public string Property { get; set; }
    public string ErrorMessage { get; set; }
    public List<CustomValidationError> Errors { get; set; } = [];
}