/**
 * Регулярное выражение tagEnd соответствует концу синтаксиса "внутри открывающего" тега.
 * Оно либо соответствует `>`, либо последовательности, напоминающей атрибут, либо концу строки после пробела (позиция атрибута).
 *
 * См. атрибуты в спецификации HTML:
 * https://www.w3.org/TR/html5/syntax.html#elements-attributes
 *
 * " \t\n\f\r" являются HTML-пробельными символами:
 * https://infra.spec.whatwg.org/#ascii-whitespace
 *
 * Таким образом, атрибут это:
 *  * Имя: любой символ, кроме пробельного символа, ("), ('), ">",
 *    "=", or "/". Обратите внимание: это отличается от спецификации HTML, которая также исключает управляющие символы.
 *  * За которым следуют ноль или более пробельных символов.
 *  * За которым следует "=".
 *  * За которым следуют ноль или более пробельных символов.
 *  * За которым следует:
 *    * Любой символ, кроме пробела, ('), ("), "<", ">", "=", (`), или
 *    * (") за которым следует любой символ, кроме ("), или
 *    * (') за которым следует любой символ, кроме (').
 */
export type TagEndRegex = RegExp