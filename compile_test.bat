cls
pushd %~dp0
java -jar ../../_closure/compiler.jar ^
--js ../../_closure/goog/base.js ^
--create_source_map source_map ^
--generate_exports ^
--export_local_property_definitions ^
--compilation_level ADVANCED_OPTIMIZATIONS ^
--isolation_mode IIFE ^
--warning_level VERBOSE ^
--language_in ES_NEXT ^
--language_out ES5_STRICT ^
--externs ../../_closure/externs/effect.externs.js ^
--js js/common.js ^
--js js/test_effect.js ^
--js_output_file js/test_effect.min.js
popd