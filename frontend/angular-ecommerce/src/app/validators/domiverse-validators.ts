import { FormControl, ValidationErrors } from "@angular/forms";

export class DomiverseValidators {

    // Custom validator để kiểm tra khoảng trắng
    static notOnlyWhitespace(control: FormControl) : ValidationErrors | null {

        // Kiểm tra nếu chuỗi chỉ chứa toàn khoảng trắng
        if ((control.value != null) && (control.value.trim().length === 0)) {

            // Nếu không hợp lệ, trả về một đối tượng lỗi
            // Tên lỗi là 'notOnlyWhitespace', HTML sẽ bắt lỗi theo tên này
            return { 'notOnlyWhitespace': true };
        }
        else {
            // Hợp lệ, trả về null
            return null;
        }
    }
}